import { Request, Response } from "express"
import { verifyAuth } from "../middlewares/auth.middleware"
import { apiStore } from "../db"
import { TodoEntity } from "../types/todo.entity"

export default {
  GET: {
    "/": [
      verifyAuth,
      async (req: Request, res: Response) => {
        const userId = req.userId
        if (!userId) return res.status(500).json({ success: false, __toastify: [{ type: "error", message: "Internal server error" }] })

        const todo = (await apiStore.prepare("SELECT * FROM Todos WHERE userId = ?").all(userId)) as TodoEntity[]

        res.status(200).json({
          success: true,
          todo: todo.map(({ status, todoId, label }) => {
            return {
              id: todoId,
              label,
              status: status >= 1 ? true : false,
            }
          }),
        })
      },
    ],
  },

  POST: {},

  PUT: {},

  PATCH: {},

  DELETE: {},
}
