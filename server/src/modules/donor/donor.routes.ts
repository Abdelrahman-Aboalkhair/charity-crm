import { Router } from "express";
import protect from "@/shared/middlewares/protect";
import { makeDonorController } from "./donor.factory";

const router = Router();
const donorController = makeDonorController();

router.post("/", protect, donorController.createDonor);
router.post("/bulk", protect, donorController.bulkImportDonors);

router.get("/:id", protect, donorController.getDonorById);

router.get("/", protect, donorController.getDonors);

router.put("/:id", protect, donorController.updateDonor);

router.delete("/:id", protect, donorController.deleteDonor);

export default router;
