import { JwtPayload, sign, verify } from "jsonwebtoken"
import type { Response, Request, NextFunction } from "express"

interface JwtAuthDecoded extends JwtPayload {
  userId: string
  exp: number
  renew: number
}

export const auth = {
  payload: { userId: "", exp: 0, renew: 0 },

  currentTime(add: number = 0) {
    return parseInt(`${new Date().getTime() / 1000}`) + add
  },
  sign(res: Response, userId: string) {
    const token = sign({ userId, renew: this.currentTime(300) } as JwtAuthDecoded, "gY4J3gaauRU9nE3CUpn6LetE0", { expiresIn: "30m" })

    res.header("authorization", `Bearer ${token}`)
  },
  verify(token: string) {
    this.payload = verify(token, "gY4J3gaauRU9nE3CUpn6LetE0", { ignoreExpiration: true }) as JwtAuthDecoded
  },
  isValid() {
    return this.currentTime() < this.payload.exp
  },
  isRenewable() {
    return this.currentTime() > this.payload.renew
  },
}

export const verifyAuth = async (req: Request, res: Response, next: NextFunction) => {
  let authorization = req.headers.authorization as string | undefined

  if (!authorization) return res.status(403).json({ msg: "No token provided" })

  // Remove Bearer from string case
  if (authorization.startsWith("Bearer ")) {
    authorization = authorization.slice(7, authorization.length)
    if (!authorization || authorization === "") return res.status(403).json({ msg: "No bearer token provided" })
  }

  auth.verify(authorization)

  if (!auth.isValid()) {
    return res.status(401).json({ success: false })
  } else if (auth.isRenewable()) {
    auth.sign(res, auth.payload.userId)
  }

  next()
}
