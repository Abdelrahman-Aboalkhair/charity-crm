import { ReservationController } from "./reservation.controller";
import { ReservationRepository } from "./reservation.repository";
import { ReservationService } from "./reservation.service";
import { DonorRepository } from "../donor/donor.repository";

export const makeReservationController = () => {
  const reservationRepository = new ReservationRepository();
  const donorRepository = new DonorRepository();
  const reservationService = new ReservationService(
    reservationRepository,
    donorRepository
  );
  const reservationController = new ReservationController(reservationService);

  return reservationController;
};
