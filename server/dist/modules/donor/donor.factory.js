"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeDonorController = void 0;
const donation_repository_1 = require("../donation/donation.repository");
const donor_controller_1 = require("./donor.controller");
const donor_repository_1 = require("./donor.repository");
const donor_service_1 = require("./donor.service");
const makeDonorController = () => {
    const donorRepository = new donor_repository_1.DonorRepository();
    const donationRepository = new donation_repository_1.DonationRepository();
    const service = new donor_service_1.DonorService(donorRepository, donationRepository);
    const controller = new donor_controller_1.DonorController(service);
    return controller;
};
exports.makeDonorController = makeDonorController;
