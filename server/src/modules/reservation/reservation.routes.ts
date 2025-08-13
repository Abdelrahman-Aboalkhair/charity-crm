import { Router } from "express";
import protect from "@/shared/middlewares/protect";
import { makeReservationController } from "./reservation.factory";

const router = Router();
const reservationController = makeReservationController();

router.post("/", protect, (req, res, next) =>
  reservationController.createReservation(req, res, next)
);

router.get("/:id", protect, (req, res, next) =>
  reservationController.getReservationById(req, res, next)
);

router.get("/", protect, (req, res, next) =>
  reservationController.getReservations(req, res, next)
);

router.put("/:id", protect, (req, res, next) =>
  reservationController.updateReservation(req, res, next)
);

router.delete("/:id", protect, (req, res, next) =>
  reservationController.deleteReservation(req, res, next)
);

export default router;
