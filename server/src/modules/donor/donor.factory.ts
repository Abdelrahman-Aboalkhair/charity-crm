import { DonationRepository } from "../donation/donation.repository";
import { DonorController } from "./donor.controller";
import { DonorRepository } from "./donor.repository";
import { DonorService } from "./donor.service";

export const makeDonorController = () => {
  const donorRepository = new DonorRepository();
  const donationRepository = new DonationRepository();
  const service = new DonorService(donorRepository, donationRepository);
  const controller = new DonorController(service);

  return controller;
};
