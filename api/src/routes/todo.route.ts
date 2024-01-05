import { Router } from "express"

const router = Router()

import todoController from "../controllers/todo.controller"

router.get("/", todoController.GET["/"])

router.post("/", todoController.POST["/"])

export default router
