"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const protect_1 = __importDefault(require("@/shared/middlewares/protect"));
const reservation_factory_1 = require("./reservation.factory");
const router = (0, express_1.Router)();
const reservationController = (0, reservation_factory_1.makeReservationController)();
router.post("/", protect_1.default, (req, res, next) => reservationController.createReservation(req, res, next));
router.get("/:id", protect_1.default, (req, res, next) => reservationController.getReservationById(req, res, next));
router.get("/", protect_1.default, (req, res, next) => reservationController.getReservations(req, res, next));
router.put("/:id", protect_1.default, (req, res, next) => reservationController.updateReservation(req, res, next));
router.delete("/:id", protect_1.default, (req, res, next) => reservationController.deleteReservation(req, res, next));
exports.default = router;
