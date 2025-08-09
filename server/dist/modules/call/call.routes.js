"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const call_controller_1 = require("./call.controller");
const protect_1 = __importDefault(require("@/shared/middlewares/protect"));
const router = (0, express_1.Router)();
const callController = new call_controller_1.CallController();
router.post("/", protect_1.default, (req, res, next) => callController.logCall(req, res, next));
router.get("/:id", protect_1.default, (req, res, next) => callController.getCallById(req, res, next));
router.get("/", protect_1.default, (req, res, next) => callController.getCalls(req, res, next));
router.put("/:id", protect_1.default, (req, res, next) => callController.updateCall(req, res, next));
router.delete("/:id", protect_1.default, (req, res, next) => callController.deleteCall(req, res, next));
exports.default = router;
