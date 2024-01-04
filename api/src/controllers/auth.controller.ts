import { Request, Response } from "express"
import { apiStore } from "../db"
import { auth, verifyAuth } from "../middlewares/auth.middleware"
import { bcrypt, generateUUID } from "../utils/tools"
import { authValidator } from "../validators/authValidator"
import { matchedData, validationResult } from "express-validator"

export default {
  GET: {
    "/me": [
      verifyAuth,
      async (req: Request, res: Response) => {
        res.status(200).json({ success: true })
      },
    ],
  },

  POST: {
    "/sign-up": [
      authValidator.validators.email,
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
        const { email, password } = matchedData(req) as { email: string; password: string }

        const hash = await bcrypt.hash(password ?? "")
        await apiStore.prepare("INSERT INTO Users (userId, email, password) VALUES (?,?,?)").run(generateUUID(email), email, hash)

        const { userId } = (await apiStore.prepare("SELECT userId FROM Users WHERE email = ?").get(email)) as { userId: string }
        if (userId) {
          auth.sign(res, userId)
        }

        res.status(200).json({ success: true, __toastify: [{ type: "success", message: "Compte ajouté" }] })
      },
    ],

    "/sign-in": [
      authValidator.validators.email,
      async (req: Request, res: Response) => {
        const user = (await apiStore.prepare("SELECT userId, password FROM Users WHERE email = ?").get(req.body.email ?? "")) as
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
