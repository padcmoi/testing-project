import { matchedData, validationResult } from "express-validator"
import type { Request, Response } from "express"
import { verifyAuth } from "../middlewares/auth.middleware"
import { apiStore } from "../db"
import { TodoEntity } from "../types/todo.entity"
import { todoValidator } from "../validators/todoValidator"
import { generateUUID } from "../utils/tools"

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

  POST: {
    "/": [
      verifyAuth,
      todoValidator.validators.label,
      async (req: Request, res: Response) => {
        const userId = req.userId
        if (!userId) return res.status(500).json({ success: false, __toastify: [{ type: "error", message: "Internal server error" }] })

        await todoValidator.sanitize.me(Object.keys(req.body)).run(req)
        const { label } = matchedData(req) as { label?: string }

        await apiStore.prepare("INSERT INTO Todos (todoId, label, status, userId) VALUES (?,?,?,?)").run(generateUUID(""), label, 0, userId)

        res.status(201).json({
          success: true,
        })
      },
    ],
  },

  PUT: {
    "/:todoId": [
      verifyAuth,
      todoValidator.validators.status,
      async (req: Request, res: Response) => {
        const userId = req.userId
        const todoId = req.params.todoId as string
        if (!userId) return res.status(500).json({ success: false, __toastify: [{ type: "error", message: "Internal server error" }] })

        const exists = await apiStore.prepare("SELECT todoId FROM Todos WHERE todoId = ? AND userId = ?").get(todoId, userId)
        if (!exists) {
          return res.status(404).json({
            success: false,
            __toastify: [{ type: "error", message: "Ce TODO n'existe pas ou a été supprimé" }],
          })
        }

        if (!validationResult(req).isEmpty()) {
          return res.status(403).json({
            success: false,
            __toastify: validationResult(req)
              .array()
              .map((error) => ({ type: "error", message: error.msg })),
          })
        }

        await todoValidator.sanitize.me(Object.keys(req.body)).run(req)
        const { status } = matchedData(req) as { status?: boolean }

        apiStore.prepare("UPDATE Todos SET status = ? WHERE todoId = ? AND userId = ?").run(status ? 1 : 0, todoId, userId)

        res.status(200).json({ success: true })
      },
    ],
  },

  PATCH: {},

  DELETE: {},
}
