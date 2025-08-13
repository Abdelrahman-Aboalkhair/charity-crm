"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeReservationController = void 0;
const reservation_controller_1 = require("./reservation.controller");
const reservation_repository_1 = require("./reservation.repository");
const reservation_service_1 = require("./reservation.service");
const donor_repository_1 = require("../donor/donor.repository");
const makeReservationController = () => {
    const reservationRepository = new reservation_repository_1.ReservationRepository();
    const donorRepository = new donor_repository_1.DonorRepository();
    const reservationService = new reservation_service_1.ReservationService(reservationRepository, donorRepository);
    const reservationController = new reservation_controller_1.ReservationController(reservationService);
    return reservationController;
};
exports.makeReservationController = makeReservationController;
