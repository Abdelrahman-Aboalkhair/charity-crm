import { Router } from "express";
import protect from "@/shared/middlewares/protect";
import { makeDonorController } from "./donor.factory";

const router = Router();
const donorController = makeDonorController();

router.post("/", protect, (req, res, next) =>
  donorController.createDonor(req, res, next)
);
router.post("/bulk", protect, (req, res, next) =>
  donorController.bulkImportDonors(req, res, next)
);

router.get("/:id", protect, (req, res, next) =>
  donorController.getDonorById(req, res, next)
);

router.get("/", protect, (req, res, next) =>
  donorController.getDonors(req, res, next)
);

router.put("/:id", protect, (req, res, next) =>
  donorController.updateDonor(req, res, next)
);

router.delete("/:id", protect, (req, res, next) =>
  donorController.deleteDonor(req, res, next)
);

export default router;
