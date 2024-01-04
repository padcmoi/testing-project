import { Request, Response } from "express"
import { apiStore } from "../db"
import { auth, verifyAuth } from "../middlewares/auth.middleware"
import { bcrypt, generateUUID, slugify } from "../utils/tools"
import { authValidator } from "../validators/authValidator"
import { matchedData, validationResult } from "express-validator"

export default {
  GET: {
    "/me": [
      verifyAuth,
      async (req: Request, res: Response) => {
        const user = await apiStore.prepare("SELECT identifier FROM Users WHERE userId = ?").get(req.userId)

        res.status(200).json({ success: true, user: user ? user : null })
      },
    ],
  },

  POST: {
    "/sign-up": [
      authValidator.validators.identifier,
      authValidator.validators.password,
      async (req: Request, res: Response) => {
        if (!validationResult(req).isEmpty()) {
          return res.status(403).json({
            success: false,
            __toastify: validationResult(req)
              .array()
              .map((error) => ({ type: "error", message: error.msg })),
          })
        }

        await authValidator.sanitize.me(Object.keys(req.body)).run(req)
        const { identifier, password } = matchedData(req) as { identifier: string; password: string }

        const hash = await bcrypt.hash(password ?? "")
        await apiStore.prepare("INSERT INTO Users (userId, identifier, password) VALUES (?,?,?)").run(generateUUID(identifier), slugify(identifier), hash)

        const { userId } = (await apiStore.prepare("SELECT userId FROM Users WHERE identifier = ?").get(slugify(identifier))) as { userId: string }
        if (userId) {
          auth.sign(res, userId)
        }

        res.status(200).json({ success: true, __toastify: [{ type: "success", message: "Compte ajouté" }] })
      },
    ],

    "/sign-in": [
      async (req: Request, res: Response) => {
        const user = (await apiStore.prepare("SELECT userId, password FROM Users WHERE identifier = ?").get(slugify(req.body.identifier ?? ""))) as
          | { userId: string; password: string }
          | undefined
        if (!user || !bcrypt.matchSync(req.body.password ?? "", user.password)) {
          res.status(401).json({ success: false, __toastify: [{ type: "error", message: "Identifiants erronés" }] })
        } else {
          auth.sign(res, user.userId)

          res.status(201).json({ success: true, __toastify: [{ type: "success", message: "Connecté" }] })
        }
      },
    ],
  },

  PUT: {},

  PATCH: {},

  DELETE: {},
}
