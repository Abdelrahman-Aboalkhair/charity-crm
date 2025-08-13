"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const protect_1 = __importDefault(require("@/shared/middlewares/protect"));
const call_factory_1 = require("./call.factory");
const router = (0, express_1.Router)();
const callController = (0, call_factory_1.makeCallController)();
router.post("/", protect_1.default, (req, res, next) => callController.logCall(req, res, next));
router.get("/:id", protect_1.default, (req, res, next) => callController.getCallById(req, res, next));
router.get("/", protect_1.default, (req, res, next) => callController.getCalls(req, res, next));
router.put("/:id", protect_1.default, (req, res, next) => callController.updateCall(req, res, next));
router.delete("/:id", protect_1.default, (req, res, next) => callController.deleteCall(req, res, next));
exports.default = router;
