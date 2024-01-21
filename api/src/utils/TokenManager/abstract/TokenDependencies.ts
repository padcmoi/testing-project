import { sign, verify } from "jsonwebtoken"
import dotenv from "dotenv"
import { tokenStore } from "../tokenStore"
import { generateUUID } from "../../tools"
import DateCustom from "../libraries/DateCustom"
import type { ITokenDependencies, JwtAuthDecoded, JwtRefreshDecoded, ResponseTokenManager, TokenResponse } from "../../../types/token.manager"
dotenv.config()

const CONFIG = {
  refreshRenewTime: 1500,
  refreshExpireLongTime: 2592000,
  refreshExpireShortTime: 1800,

  authExpireTime: 360,

  AUTH_PRIVATE_KEY: process.env.JWT_AUTH_PRIVATE_KEY ?? "jE2OTg0OTUzI1NiIsInRQ4MzZ9",
  REFRESH_PRIVATE_KEY: process.env.JWT_REFRESH_PRIVATE_KEY ?? "Njk4NDk0ODASwiaWF0IjoiOjE2OTg1ODEyMDZ9",
}

/**
 * Dependencies at AuthManager classes, not exportable
 */
export abstract class TokenDependencies {
  protected userId?: JwtAuthDecoded["userId"] // user identifier
  protected response: ResponseTokenManager // save response after checkTokens analysis
  protected authorToken: string | null // Cookie comparaison token, prevent xss token steal
  /** @auth display new token @refresh display new token @immediately Renew Tokens immediately to 1st connection */
  protected toBeRenewed: ITokenDependencies["toBeRenewed"] = { auth: false, refresh: false, immediately: false }

  /**
   * check in the payload if the token is ready to renewable
   */
  protected isRenewable(payload: JwtRefreshDecoded) {
    return payload.renew < parseInt(`${new Date().getTime() / 1000}`)
  }

  /**
   * check in the payload if the token is expired
   */
  protected isExpire(payload: JwtAuthDecoded | JwtRefreshDecoded) {
    return payload.exp < parseInt(`${new Date().getTime() / 1000}`)
  }

  /**
   * check payload structure in refresh and auth tokens
   */
  protected isValidPayload(authPayload?: JwtAuthDecoded, refreshPayload?: JwtRefreshDecoded) {
    return authPayload &&
      typeof authPayload.userId == "string" &&
      typeof authPayload.exp == "number" &&
      refreshPayload &&
      typeof refreshPayload.tokenId == "string" &&
      typeof refreshPayload.exp == "number"
      ? true
      : false
  }

  /**
   * Check if the token is not revoke
   */
  protected async isEnabledToken(tokenId: string) {
    const token = (await tokenStore.prepare("SELECT * FROM Tokens WHERE token = ? AND isRevoke = ?").get(tokenId, 0)) as TokenResponse["get"]
    // const token = await Token.findOne({ where: { token: tokenId, isRevoke: false } })
    return !!token
  }

  /**
   * Make a JWT token
   */
  protected async sign(type: "auth" | "refresh", userId: string, stayConnected: boolean = false) {
    // refresh token
    if (type == "refresh") {
      const refreshTokenExpire = stayConnected ? CONFIG.refreshExpireLongTime : CONFIG.refreshExpireShortTime
      const tokenId = generateUUID(userId)
      const renew = this.toBeRenewed.immediately ? 0 : new DateCustom().changeSeconds(+CONFIG.refreshRenewTime)
      const expireAt = new Date(new DateCustom().changeSeconds(+refreshTokenExpire))
      const renewAt = new Date(renew)

      const token = (await tokenStore
        .prepare("SELECT * FROM Tokens WHERE userId = ? AND token = ? AND isRevoke = ?")
        .get(userId, tokenId, 0)) as TokenResponse["get"]
      if (token) {
        await tokenStore
          .prepare("UPDATE Tokens SET expireAt = ?, renewAt = ? WHERE userId = ? AND token = ? AND isRevoke = ?")
          .run(DateCustom.toMysqlDate(expireAt), DateCustom.toMysqlDate(renewAt), userId, tokenId, 0)
      } else {
        await tokenStore
          .prepare("INSERT INTO Tokens (token, expireAt, renewAt, userId) VALUES (?,?,?,?)")
          .run(tokenId, DateCustom.toMysqlDate(expireAt), DateCustom.toMysqlDate(renewAt), userId)
      }

      // const token = await Token.findOne({ where: { userId, token: tokenId, isRevoke: false } })
      // if (token) await token.update({ expireAt, renewAt })
      // else await Token.create({ token: tokenId, expireAt, renewAt, userId })

      const payload: Pick<JwtRefreshDecoded, "tokenId" | "renew" | "stayConnected"> = { tokenId, renew: parseInt(`${renew / 1000}`), stayConnected }

      this.toBeRenewed.refresh = true
      return sign(payload, CONFIG.REFRESH_PRIVATE_KEY, { expiresIn: refreshTokenExpire })
    }
    // auth token
    else {
      const authorToken = generateUUID(userId) // generate token to prevent xss token steal
      this.authorToken = authorToken
      const expiresIn = this.toBeRenewed.immediately ? 0 : CONFIG.authExpireTime
      this.toBeRenewed.auth = true
      return sign({ userId, authorToken } as JwtAuthDecoded, CONFIG.AUTH_PRIVATE_KEY, { expiresIn })
    }
  }

  protected read(authToken: string, refreshToken: string) {
    const authPayload = verify(authToken, CONFIG.AUTH_PRIVATE_KEY, { ignoreExpiration: true }) as JwtAuthDecoded
    const refreshPayload = verify(refreshToken, CONFIG.REFRESH_PRIVATE_KEY, { ignoreExpiration: true }) as JwtRefreshDecoded

    if (!this.isValidPayload(authPayload, refreshPayload)) throw new Error("is not a valid JWT Payload")

    return { authPayload, refreshPayload }
  }

  /**
   * check if the auth or refresh token is true or not
   */
  public static isTrueAuthToken(type: "auth" | "refresh", authToken: string) {
    try {
      verify(authToken, type == "auth" ? CONFIG.AUTH_PRIVATE_KEY : CONFIG.REFRESH_PRIVATE_KEY, { ignoreExpiration: true })
      return true
    } catch (error) {
      return false
    }
  }
}
