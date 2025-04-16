import { Request, Response, NextFunction } from "express";
import { LocationService } from "./location.service";
import sendResponse from "@/shared/utils/sendResponse";

export class LocationController {
  private locationService: LocationService;

  constructor() {
    this.locationService = new LocationService();
  }

  async createLocation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data = req.body;
      const location = await this.locationService.createLocation(data);
      sendResponse(res, 201, {
        data: location,
        message: "Location created successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async getLocationById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const location = await this.locationService.getLocationById(id);
      sendResponse(res, 200, {
        data: location,
        message: "Location retrieved successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async getLocations(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { page = "1", limit = "10" } = req.query;
      const result = await this.locationService.getLocations({
        page: parseInt(page as string),
        limit: parseInt(limit as string),
      });
      sendResponse(res, 200, {
        data: result,
        message: "Locations retrieved successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async updateLocation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const data = req.body;
      const location = await this.locationService.updateLocation(id, data);
      sendResponse(res, 200, {
        data: location,
        message: "Location updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteLocation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      await this.locationService.deleteLocation(id);
      sendResponse(res, 200, {
        data: {},
        message: "Location deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
