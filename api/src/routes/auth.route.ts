import { Router, Request, Response } from "express"

const router = Router()

import authController from "../controllers/auth.controller"

router.get("/me", [])

router.post("/sign-up", authController.POST["/sign-up"])
router.post("/sign-in", [])

export default router
