import type { JwtPayload } from "jsonwebtoken"
import type { Response, Request } from "express"

export interface JwtAuthDecoded extends JwtPayload {
  type: "auth"
  userId: string
  authorToken: string
  exp: number
}

export interface JwtRefreshDecoded extends JwtPayload {
  type: "refresh"
  tokenId: string
  stayConnected: boolean
  exp: number
  renew: number
}

export type ResponseTokenManager = {
  status:
    | "ValidTokensContinue"
    | "RenewAuth"
    | "TokenRevoked"
    | "RenewAuthANDRefresh"
    | "TokenExpired"
    | "NewAuthANDRefresh"
    | "CookieTokenDoesntMatch"
    | "UserDisabled"
  authorization: string
  refreshToken: string
  authPayload?: JwtAuthDecoded
}

export interface IAuthManager {
  start(userId: JwtAuthDecoded["userId"]): Promise<ResponseTokenManager>
  checkTokens(authToken: string, refreshToken: string, authorToken: string): Promise<ResponseTokenManager>
  express(req: Request, res: Response): this
}

export interface ITokenDependencies {
  toBeRenewed: { auth: boolean; refresh: boolean; immediately: boolean }
}

export interface TokenAttributes {
  token?: string
  isRevoke?: boolean
  expireAt?: Date
  renewAt?: Date
  userId?: string | null
}
export interface TokenResponse {
  get?: TokenAttributes
  all: TokenAttributes[]
}
