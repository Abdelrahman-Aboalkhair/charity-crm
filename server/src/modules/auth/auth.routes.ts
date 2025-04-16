import express from "express";
import { makeAuthController } from "./auth.factory";
import {
  handleSocialLogin,
  handleSocialLoginCallback,
} from "@/shared/utils/auth/oauthUtils";

const router = express.Router();
const authController = makeAuthController();

router.get("/google", handleSocialLogin("google"));
router.get("/google/callback", handleSocialLoginCallback("google"));

router.get("/facebook", handleSocialLogin("facebook"));
router.get("/facebook/callback", handleSocialLoginCallback("facebook"));

router.get("/twitter", handleSocialLogin("twitter"));
router.get("/twitter/callback", handleSocialLoginCallback("twitter"));

router.post("/sign-up", authController.register);
router.post("/sign-in", authController.signin);
router.get("/sign-out", authController.signout);
router.get("/refresh-token", authController.refreshToken);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

export default router;
