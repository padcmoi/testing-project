import { TokenDependencies } from "./abstract/TokenDependencies"
import { tokenStore } from "./tokenStore"
import type { RunResult } from "better-sqlite3"
import type { IAuthManager, JwtAuthDecoded } from "../../types/token.manager"
import type { Response, Request } from "express"

/**
 * Main classes AuthManager
 */
export class AuthManager extends TokenDependencies implements IAuthManager {
  constructor() {
    super()
  }

  /**
   * New auth & generate tokens
   */
  async start(userId: JwtAuthDecoded["userId"], stayConnected: boolean = false) {
    this.toBeRenewed.immediately = true
    await AuthManager.purgeUser(userId) // purge old token not revoked
    const authorization = await this.sign("auth", userId)
    const refreshToken = await this.sign("refresh", userId, stayConnected)

    const { authPayload } = this.read(authorization, refreshToken)

    //! "NewAuthANDRefresh"
    this.response = { status: "NewAuthANDRefresh", authorization, refreshToken, authPayload }

    this.toBeRenewed.immediately = false // reset

    return this.response
  }

  /**
   * Require provide auth & refresh tokens and will return a status
   * Optionnaly, regenerates tokens if necessary
   * These tokens are regenerated in background with express
   * I.E  res.header("authorization", ...) && res.header("refreshtoken",... )
   */
  async checkTokens(authToken: string, refreshToken: string, authorToken: string) {
    const { authPayload, refreshPayload } = this.read(authToken, refreshToken)

    const isRenewable = this.isRenewable(refreshPayload)
    const authExpired = this.isExpire(authPayload)
    const refreshExpired = this.isExpire(refreshPayload)

    if (authPayload.authorToken != authorToken) {
      this.response = { status: "CookieTokenDoesntMatch", authorization: "", refreshToken: "" }
    } else if (refreshExpired) {
      //! "TokenExpired"
      this.response = { status: "TokenExpired", authorization: "", refreshToken: "" }
    } else if (!(await this.isEnabledToken(refreshPayload.tokenId))) {
      //! "TokenRevoked"
      this.response = { status: "TokenRevoked", authorization: "", refreshToken: "" }
    } else if (isRenewable) {
      //! "RenewAuthANDRefresh"
      await tokenStore.prepare("DELETE FROM Tokens WHERE token = ? AND isRevoke = ?").run(refreshPayload.tokenId, 0)
      // await Token.destroy({ where: { token: refreshPayload.tokenId, isRevoke: false } })

      const authorization = await this.sign("auth", authPayload.userId)
      const refreshToken = await this.sign("refresh", authPayload.userId, refreshPayload.stayConnected)
      this.response = { status: "RenewAuthANDRefresh", authorization, refreshToken, authPayload }
    } else if (authExpired) {
      //! "RenewAuth"
      const authorization = await this.sign("auth", authPayload.userId)
      this.response = { status: "RenewAuth", authorization, refreshToken, authPayload }
    } else {
      //! "ValidTokensContinue"
      this.response = { status: "ValidTokensContinue", authorization: authToken, refreshToken, authPayload }
    }

    return this.response
  }

  /**
   * Add in the express request user info
   * and tokens in headers
   */
  public express(req: Request, res: Response) {
    if (this.toBeRenewed.auth) res.header("authorization", this.response.authorization)
    if (this.toBeRenewed.refresh) res.header("refreshtoken", this.response.refreshToken)
    if (this.authorToken) {
      res.cookie("authorToken", this.authorToken, { sameSite: "none", secure: true, httpOnly: true })
      this.authorToken = null
    }
    req.user = this.response.authPayload ?? undefined
    req.userId = this.response.authPayload?.userId ?? undefined

    return this
  }

  /**
   * Tool, remove optionnaly Bearer text
   */
  public static removeBearer(token: string) {
    // Remove Bearer from string case
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length)
    }
    return token
  }

  /**
   * Just check if the token made by this API
   */
  public static lightVerification(req: Request) {
    let authorization = req.headers.authorization as string | undefined
    if (authorization) {
      const isValid = AuthManager.isTrueAuthToken("auth", AuthManager.removeBearer(authorization))

      return isValid
    }

    return false
  }

  /**
   * Disconnection user, we remove the token validity
   */
  public static async purgeUser(userId: string) {
    const response: RunResult = await tokenStore.prepare("DELETE FROM Tokens WHERE userId = ? AND isRevoke = ?").run(userId, 0)
    // const token = await Token.destroy({ where: { userId, isRevoke: false } })

    return response.changes > 0 ? true : false
  }
}
