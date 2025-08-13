import { Request, Response, NextFunction } from "express";
import sendResponse from "@/shared/utils/sendResponse";
import { CallService } from "./call.service";

export class CallController {
  constructor(private callService: CallService) {}

  async logCall(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data = req.body;
      const userId = req.user?.id;
      const call = await this.callService.logCall(data, userId);
      sendResponse(res, 201, {
        data: call,
        message: "Call logged successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async getCallById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const call = await this.callService.getCallById(id);
      sendResponse(res, 200, {
        data: call,
        message: "Call retrieved successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async getCalls(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { page = "1", limit = "10", donorId, userId } = req.query;
      const result = await this.callService.getCalls({
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        donorId: donorId as string,
        userId: userId as string,
      });
      sendResponse(res, 200, {
        data: result,
        message: "Calls retrieved successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async updateCall(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const data = req.body;
      const call = await this.callService.updateCall(id, data);
      sendResponse(res, 200, {
        data: call,
        message: "Call updated successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCall(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      await this.callService.deleteCall(id);
      sendResponse(res, 200, {
        data: {},
        message: "Call deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
