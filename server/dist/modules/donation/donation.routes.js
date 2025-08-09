"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const protect_1 = __importDefault(require("@/shared/middlewares/protect"));
const donation_factory_1 = require("./donation.factory");
const router = (0, express_1.Router)();
const donationController = (0, donation_factory_1.makeDonationController)();
router.post("/", protect_1.default, (req, res, next) => donationController.createDonation(req, res, next));
router.get("/:id", protect_1.default, (req, res, next) => donationController.getDonationById(req, res, next));
router.get("/", protect_1.default, (req, res, next) => donationController.getDonations(req, res, next));
router.put("/:id", protect_1.default, (req, res, next) => donationController.updateDonation(req, res, next));
router.delete("/:id", protect_1.default, (req, res, next) => donationController.deleteDonation(req, res, next));
exports.default = router;
