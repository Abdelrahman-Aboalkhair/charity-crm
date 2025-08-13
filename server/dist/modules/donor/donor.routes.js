"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const protect_1 = __importDefault(require("@/shared/middlewares/protect"));
const donor_factory_1 = require("./donor.factory");
const router = (0, express_1.Router)();
const donorController = (0, donor_factory_1.makeDonorController)();
router.post("/", protect_1.default, (req, res, next) => donorController.createDonor(req, res, next));
router.post("/bulk", protect_1.default, (req, res, next) => donorController.bulkImportDonors(req, res, next));
router.get("/:id", protect_1.default, (req, res, next) => donorController.getDonorById(req, res, next));
router.get("/", protect_1.default, (req, res, next) => donorController.getDonors(req, res, next));
router.put("/:id", protect_1.default, (req, res, next) => donorController.updateDonor(req, res, next));
router.delete("/:id", protect_1.default, (req, res, next) => donorController.deleteDonor(req, res, next));
exports.default = router;
