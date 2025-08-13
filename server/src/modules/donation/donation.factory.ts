import { DonorRepository } from "../donor/donor.repository";
import { DonationController } from "./donation.controller";
import { DonationRepository } from "./donation.repository";
import { DonationService } from "./donation.service";

export const makeDonationController = () => {
  const donationRepo = new DonationRepository();
  const donorRepo = new DonorRepository();
  const donationService = new DonationService(
    donorRepo,
    donationRepo
  );
  return new DonationController(donationService);
};
