import { Request, Response, NextFunction } from "express";
import sendResponse from "@/shared/utils/sendResponse";
import { ReservationService } from "./reservation.service";

export class ReservationController {
  private reservationService: ReservationService;

  constructor() {
    this.reservationService = new ReservationService();
  }

  async createReservation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { donorId, expiresAt } = req.body;
      const userId = req.user?.id;
      const reservation = await this.reservationService.createReservation(
        donorId,
        new Date(expiresAt),
        userId
      );
      sendResponse(res, 201, {
        data: reservation,
        message: "Reservation created successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async getReservationById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const reservation = await this.reservationService.getReservationById(id);
      sendResponse(res, 200, {
        data: reservation,
        message: "Reservation retrieved successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async getReservations(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { page = "1", limit = "10", donorId, userId } = req.query;
      const result = await this.reservationService.getReservations({
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        donorId: donorId as string,
        userId: userId as string,
      });
      sendResponse(res, 200, {
        data: result,
        message: "Reservations retrieved successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async updateReservation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const data = req.body;
      const reservation = await this.reservationService.updateReservation(
        id,
        data
      );
      sendResponse(res, 200, {
        data: reservation,
        message: "Reservation updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteReservation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      await this.reservationService.deleteReservation(id);
      sendResponse(res, 200, {
        data: {},
        message: "Reservation deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
