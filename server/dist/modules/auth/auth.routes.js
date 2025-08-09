"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_factory_1 = require("./auth.factory");
const router = express_1.default.Router();
const authController = (0, auth_factory_1.makeAuthController)();
router.post("/sign-up", authController.register);
router.post("/sign-in", authController.signin);
router.get("/sign-out", authController.signout);
router.get("/refresh-token", authController.refreshToken);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
exports.default = router;
