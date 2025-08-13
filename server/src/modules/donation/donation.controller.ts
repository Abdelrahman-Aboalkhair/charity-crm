import { Request, Response, NextFunction } from "express";
import { DonationService } from "./donation.service";
import sendResponse from "@/shared/utils/sendResponse";

export class DonationController {
  constructor(private donationService: DonationService) {}

  async createDonation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const donationData = req.body;
      const userId = req.user?.id;
      const donation = await this.donationService.createDonation(
        donationData,
        userId
      );
      sendResponse(res, 201, {
        data: { donation },
        message: "Donation created successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async getDonationById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const donation = await this.donationService.getDonationById(id);
      sendResponse(res, 200, {
        data: donation,
        message: "Donation retrieved successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async getDonations(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { page = "1", limit = "10", donorId } = req.query;
      const result = await this.donationService.getDonations({
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        donorId: donorId as string,
      });
      sendResponse(res, 200, {
        data: result,
        message: "Donations retrieved successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async updateDonation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const data = req.body;
      const donation = await this.donationService.updateDonation(id, data);
      sendResponse(res, 200, {
        data: donation,
        message: "Donation updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteDonation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      await this.donationService.deleteDonation(id);
      sendResponse(res, 200, {
        data: {},
        message: "Donation deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
