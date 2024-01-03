import { Router, Request, Response } from "express"

const router = Router()

import authController from "../controllers/auth.controller"

router.get("/me", authController.GET["/me"])

router.post("/sign-up", authController.POST["/sign-up"])
router.post("/sign-in", authController.POST["/sign-in"])

export default router
