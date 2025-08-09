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
router.post("/", protect_1.default, donorController.createDonor);
router.post("/bulk", protect_1.default, donorController.bulkImportDonors);
router.get("/:id", protect_1.default, donorController.getDonorById);
router.get("/", protect_1.default, donorController.getDonors);
router.put("/:id", protect_1.default, donorController.updateDonor);
router.delete("/:id", protect_1.default, donorController.deleteDonor);
exports.default = router;
