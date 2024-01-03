import { Request, Response } from "express"
import { apiStore } from "../db"
import { auth } from "../middlewares/auth.middleware"
import { bcrypt, generateUUID } from "../utils/tools"
import { authValidator } from "../validators/authValidator"
import { matchedData, validationResult } from "express-validator"

export default {
  GET: {},

  POST: {
    "/sign-up": [
      authValidator.validators.email,
      authValidator.validators.password,
      async (req: Request, res: Response) => {
        if (!validationResult(req).isEmpty()) {
          return res.status(403).json({
            success: false,
            errors: validationResult(req)
              .array()
              .map((error) => error.msg),
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

        res.status(200).json({ success: true })
      },
    ],
  },

  PUT: {},

  PATCH: {},

  DELETE: {},
}
