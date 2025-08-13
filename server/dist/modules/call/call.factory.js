"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeCallController = void 0;
const call_controller_1 = require("./call.controller");
const call_repository_1 = require("./call.repository");
const call_service_1 = require("./call.service");
const donor_repository_1 = require("../donor/donor.repository");
const makeCallController = () => {
    const callRepository = new call_repository_1.CallRepository();
    const donorRepository = new donor_repository_1.DonorRepository();
    const callService = new call_service_1.CallService(callRepository, donorRepository);
    const callController = new call_controller_1.CallController(callService);
    return callController;
};
exports.makeCallController = makeCallController;
