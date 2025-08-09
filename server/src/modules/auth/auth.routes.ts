import express from "express";
import { makeAuthController } from "./auth.factory";

const router = express.Router();
const authController = makeAuthController();

router.post("/sign-up", authController.register);
router.post("/sign-in", authController.signin);
router.get("/sign-out", authController.signout);
router.get("/refresh-token", authController.refreshToken);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

export default router;
