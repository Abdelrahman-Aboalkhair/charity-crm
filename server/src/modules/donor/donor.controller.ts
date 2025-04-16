import { Request, Response, NextFunction } from "express";
import { DonorService } from "./donor.service";
import sendResponse from "@/shared/utils/sendResponse";

export class DonorController {
  private donorService: DonorService;

  constructor() {
    this.donorService = new DonorService();
  }

  async createDonor(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data = req.body;
      const donor = await this.donorService.createDonor(data);
      sendResponse(res, 201, {
        data: { donor },
        message: "Donor created successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async getDonorById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const donor = await this.donorService.getDonorById(id);
      sendResponse(res, 200, {
        data: { donor },
        message: "Donor retrieved successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async getDonors(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { page = "1", limit = "10", search } = req.query;
      const result = await this.donorService.getDonors({
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        search: search as string,
      });
      sendResponse(res, 200, {
        data: { donors: result.donors, total: result.total },
        message: "Donors retrieved successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async updateDonor(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const data = req.body;
      const donor = await this.donorService.updateDonor(id, data);
      sendResponse(res, 200, {
        data: { donor },
        message: "Donor updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteDonor(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      await this.donorService.deleteDonor(id);
      sendResponse(res, 200, {
        message: "Donor deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
