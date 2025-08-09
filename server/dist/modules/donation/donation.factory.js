"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeDonationController = void 0;
const donor_repository_1 = require("../donor/donor.repository");
const donor_service_1 = require("../donor/donor.service");
const donation_controller_1 = require("./donation.controller");
const donation_repository_1 = require("./donation.repository");
const donation_service_1 = require("./donation.service");
const makeDonationController = () => {
    const donationRepo = new donation_repository_1.DonationRepository();
    const donorRepo = new donor_repository_1.DonorRepository();
    const donorService = new donor_service_1.DonorService(donorRepo, donationRepo);
    const donationService = new donation_service_1.DonationService(donorRepo, donationRepo, donorService);
    return new donation_controller_1.DonationController(donationService);
};
exports.makeDonationController = makeDonationController;
