import request from "supertest"
import express from "express"
import { verify } from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()
import { AuthManager } from "../AuthManager"
import { tokenStore } from "../tokenStore"
import { validateUUID } from "../../../utils/tools"
import type { JwtRefreshDecoded, ResponseTokenManager } from "../../../types/token.manager"

const REFRESH_PRIVATE_KEY = process.env.JWT_REFRESH_PRIVATE_KEY ?? "Njk4NDk0ODASwiaWF0IjoiOjE2OTg1ODEyMDZ9"

describe("TokenManager", () => {
  describe("AuthManager utilities", () => {
    test("AuthManager.removeBearer", () => {
      const token = "eyJhbGciOiJIUzI1NiIsInJ9.eyJ1c2VzOTgyfQ.CgH9QkPNn02t1RndOAs"

      expect(AuthManager.removeBearer(`Bearer ${token}`)).toEqual(token)
    })

    test("AuthManager.lightVerification", async () => {
      const response = await new AuthManager().start("fd5b1b1e-a80d-526b-9d80-391b2c25ed06", true)

      const app = await express().get("/", (req, res) => res.json({ lightVerification: AuthManager.lightVerification(req) }))

      const res = await request(app).get("/").set("Authorization", response.authorization)

      expect(res.body.lightVerification).toBeTruthy()
    })
  })

  describe("Create Tokens on authentification", () => {
    let response: ResponseTokenManager, authManager: AuthManager
    beforeAll(async () => {
      authManager = new AuthManager()
      response = await authManager.start("fd5b1b1e-a80d-526b-9d80-391b2c25ed06", true)
    })

    test("authorization JWT created & valid", async () => {
      expect(AuthManager.isTrueAuthToken("auth", response.authorization)).toBeTruthy()
    })
    test("refreshToken JWT created & valid", async () => {
      expect(AuthManager.isTrueAuthToken("refresh", response.refreshToken)).toBeTruthy()
    })
    test("read refreshToken and verify if exists in the database", async () => {
      const refreshPayload = verify(response.refreshToken, REFRESH_PRIVATE_KEY, { ignoreExpiration: true }) as JwtRefreshDecoded

      const token = await tokenStore.prepare("SELECT * FROM Tokens WHERE token = ?").get(refreshPayload.tokenId)

      expect(token).toBeDefined()
    })
    test("cookie auth token uuid valid format", async () => {
      expect(validateUUID(response.authPayload?.authorToken ?? "")).toBeTruthy()
    })

    describe("Implementation by AuthManager.express(req,res)", () => {
      let res: any
      beforeAll(async () => {
        const app = await express().get("/", (req, res) => {
          authManager.express(req, res)
          res.json({})
        })

        res = await request(app).get("/")
      })
      test("check authorization", async () => {
        expect(AuthManager.isTrueAuthToken("auth", res.header.authorization)).toBeTruthy()
      })
      test("check refreshtoken", async () => {
        expect(AuthManager.isTrueAuthToken("refresh", res.header.refreshtoken)).toBeTruthy()
      })
      test("check auth cookie", async () => {
        const cookie = (res.header["set-cookie"][0] as string).split(" ")

        expect((res.header["set-cookie"][0] as string).includes("authorToken")).toBeTruthy()
        expect(cookie.includes("Secure;")).toBeTruthy()
        expect(cookie.includes("HttpOnly;")).toBeTruthy()
        expect(cookie.includes("SameSite=None")).toBeTruthy()
      })
      test("compare auth cookie to auth payload", async () => {
        const cookie = (res.header["set-cookie"][0] as string).split(" ")

        const authorToken = cookie
          .find((el) => el.includes("authorToken"))
          ?.split("=")
          .reverse()[0]
          .split(";")

        expect(authorToken?.[0] ?? "").toEqual(response.authPayload?.authorToken ?? "")
      })
    })
  })

  describe("Check Tokens", () => {
    let response: ResponseTokenManager
    beforeAll(async () => {
      const authManager = new AuthManager()
      response = await authManager.start("fd5b1b1e-a80d-526b-9d80-391b2c25ed06", true)
    })

    test("check structure response", async () => {
      const authManager = new AuthManager()
      const response2 = await authManager.checkTokens(response.authorization, response.refreshToken, response.authPayload?.authorToken ?? "")

      expect(Object.keys(response2)).toEqual(["status", "authorization", "refreshToken", "authPayload"])
      expect(Object.keys(response2.authPayload ?? {})).toEqual(["userId", "authorToken", "iat", "exp"])
    })
  })
})
