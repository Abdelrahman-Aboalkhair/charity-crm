import { CallController } from "./call.controller";
import { CallRepository } from "./call.repository";
import { CallService } from "./call.service";
import { DonorRepository } from "../donor/donor.repository";

export const makeCallController = () => {
  const callRepository = new CallRepository();
  const donorRepository = new DonorRepository();
  const callService = new CallService(callRepository, donorRepository);
  const callController = new CallController(callService);

  return callController;
};
