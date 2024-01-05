import { Router } from "express"
import authRoute from "./auth.route"
import todoRoute from "./todo.route"

const router = Router()

router.use("/auth", authRoute)
router.use("/todo", todoRoute)

export default router
