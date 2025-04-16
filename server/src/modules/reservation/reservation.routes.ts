import { Router } from "express";
import { ReservationController } from "./reservation.controller";
import protect from "@/shared/middlewares/protect";

const router = Router();
const reservationController = new ReservationController();

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
