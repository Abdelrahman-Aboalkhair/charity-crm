import { Router } from "express";
import protect from "@/shared/middlewares/protect";
import { LocationController } from "./location.controller";

const router = Router();
const locationController = new LocationController();

router.post("/", protect, (req, res, next) =>
  locationController.createLocation(req, res, next)
);

router.get("/:id", protect, (req, res, next) =>
  locationController.getLocationById(req, res, next)
);

router.get("/", protect, (req, res, next) =>
  locationController.getLocations(req, res, next)
);

router.put("/:id", protect, (req, res, next) =>
  locationController.updateLocation(req, res, next)
);

router.delete("/:id", protect, (req, res, next) =>
  locationController.deleteLocation(req, res, next)
);

export default router;
