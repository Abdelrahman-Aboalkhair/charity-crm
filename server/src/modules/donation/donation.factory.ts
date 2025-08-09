import { DonorRepository } from "../donor/donor.repository";
import { DonorService } from "../donor/donor.service";
import { DonationController } from "./donation.controller";
import { DonationRepository } from "./donation.repository";
import { DonationService } from "./donation.service";

export const makeDonationController = () => {
  const donationRepo = new DonationRepository();
  const donorRepo = new DonorRepository();
  const donorService = new DonorService(donorRepo, donationRepo);
  const donationService = new DonationService(
    donorRepo,
    donationRepo,
    donorService
  );
  return new DonationController(donationService);
};
