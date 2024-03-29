import { Router } from "express"

const router = Router()

import todoController from "../controllers/todo.controller"

router.get("/", todoController.GET["/"])

router.post("/", todoController.POST["/"])

router.put("/", todoController.PUT["/"])
router.put("/:todoId", todoController.PUT["/:todoId"])

router.delete("/:todoId", todoController.DELETE["/:todoId"])

export default router
