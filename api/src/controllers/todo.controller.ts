import { Request, Response } from "express"
import { verifyAuth } from "../middlewares/auth.middleware"

export default {
  GET: {
    "/": [
      verifyAuth,
      (req: Request, res: Response) => {
        res.status(200).json({})
      },
    ],
  },

  POST: {},

  PUT: {},

  PATCH: {},

  DELETE: {},
}
