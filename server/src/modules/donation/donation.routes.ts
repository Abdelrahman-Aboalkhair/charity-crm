import { Router } from "express";
import protect from "@/shared/middlewares/protect";
import { DonationController } from "./donation.controller";

const router = Router();
const donationController = new DonationController();

router.post("/", protect, (req, res, next) =>
  donationController.createDonation(req, res, next)
);

router.get("/:id", protect, (req, res, next) =>
  donationController.getDonationById(req, res, next)
);

router.get("/", protect, (req, res, next) =>
  donationController.getDonations(req, res, next)
);

router.put("/:id", protect, (req, res, next) =>
  donationController.updateDonation(req, res, next)
);

router.delete("/:id", protect, (req, res, next) =>
  donationController.deleteDonation(req, res, next)
);

export default router;
