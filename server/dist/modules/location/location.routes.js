"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const protect_1 = __importDefault(require("@/shared/middlewares/protect"));
const location_controller_1 = require("./location.controller");
const router = (0, express_1.Router)();
const locationController = new location_controller_1.LocationController();
router.post("/", protect_1.default, (req, res, next) => locationController.createLocation(req, res, next));
router.get("/:id", protect_1.default, (req, res, next) => locationController.getLocationById(req, res, next));
router.get("/", protect_1.default, (req, res, next) => locationController.getLocations(req, res, next));
router.put("/:id", protect_1.default, (req, res, next) => locationController.updateLocation(req, res, next));
router.delete("/:id", protect_1.default, (req, res, next) => locationController.deleteLocation(req, res, next));
exports.default = router;
