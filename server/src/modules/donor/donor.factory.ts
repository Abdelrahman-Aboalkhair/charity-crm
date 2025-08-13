import { DonorController } from "./donor.controller";
import { DonorRepository } from "./donor.repository";
import { DonorService } from "./donor.service";

export const makeDonorController = () => {
  const donorRepository = new DonorRepository();
  const service = new DonorService(donorRepository);
  const controller = new DonorController(service);

  return controller;
};
