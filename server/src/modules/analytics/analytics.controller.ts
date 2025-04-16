import { Request, Response } from "express";
import asyncHandler from "@/shared/utils/asyncHandler";
import sendResponse from "@/shared/utils/sendResponse";
import AppError from "@/shared/errors/AppError";
import { AnalyticsService } from "./analytics.service";
import { ExportUtils } from "@/shared/utils/exportUtils";
import { DateRangeQuery, ExportableData } from "./analytics.types";
import { makeLogsService } from "../logs/logs.factory";

export class AnalyticsController {
  private logsService = makeLogsService();
  constructor(
    private analyticsService: AnalyticsService,
    private exportUtils: ExportUtils
  ) {}

  getAnalyticsOverview = asyncHandler(async (req: Request, res: Response) => {
    const { timePeriod, year, startDate, endDate } = req.query;
    const validPeriods = [
      "last7days",
      "lastMonth",
      "lastYear",
      "allTime",
      "custom",
    ];

    if (!timePeriod || !validPeriods.includes(timePeriod as string)) {
      throw new AppError(
        400,
        "Invalid or missing timePeriod. Use: last7days, lastMonth, lastYear, allTime, or custom"
      );
    }

    let selectedYear: number | undefined;
    if (year) {
      selectedYear = parseInt(year as string, 10);
      if (isNaN(selectedYear)) {
        throw new AppError(400, "Invalid year format.");
      }
    }

    // Validate custom date range
    let customStartDate: Date | undefined;
    let customEndDate: Date | undefined;
    if (startDate && endDate) {
      customStartDate = new Date(startDate as string);
      customEndDate = new Date(endDate as string);

      if (isNaN(customStartDate.getTime()) || isNaN(customEndDate.getTime())) {
        throw new AppError(
          400,
          "Invalid startDate or endDate format. Use YYYY-MM-DD."
        );
      }

      if (customStartDate > customEndDate) {
        throw new AppError(400, "startDate must be before endDate.");
      }
    } else if (startDate || endDate) {
      throw new AppError(
        400,
        "Both startDate and endDate must be provided for a custom range."
      );
    }

    const overview = await this.analyticsService.getAnalyticsOverview({
      timePeriod: timePeriod as string,
      year: selectedYear,
      startDate: customStartDate,
      endDate: customEndDate,
    });

    sendResponse(res, 200, {
      data: overview,
      message: "Analytics overview retrieved successfully",
    });
  });

  getProductPerformance = asyncHandler(async (req: Request, res: Response) => {
    const { timePeriod, year, startDate, endDate, category } = req.query;
    const performance = await this.analyticsService.getProductPerformance({
      timePeriod: timePeriod as string,
      year: year ? parseInt(year as string, 10) : undefined,
      startDate: startDate ? new Date(startDate as string) : undefined,
      endDate: endDate ? new Date(endDate as string) : undefined,
      category: category as string,
    });

    console.log("performace: ", performance);

    sendResponse(res, 200, {
      data: { performance },
      message: "Product performance retrieved successfully",
    });
  });

  getCustomerAnalytics = asyncHandler(async (req: Request, res: Response) => {
    const { timePeriod, year, startDate, endDate } = req.query;
    const validPeriods = [
      "last7days",
      "lastMonth",
      "lastYear",
      "allTime",
      "custom",
    ];

    // Validate timePeriod
    if (!timePeriod || !validPeriods.includes(timePeriod as string)) {
      throw new AppError(
        400,
        "Invalid or missing timePeriod. Use: last7days, lastMonth, lastYear, allTime, or custom"
      );
    }

    // Validate year if provided
    let selectedYear: number | undefined;
    if (year) {
      selectedYear = parseInt(year as string, 10);
      if (isNaN(selectedYear)) {
        throw new AppError(400, "Invalid year format.");
      }
    }

    // Validate custom date range
    let customStartDate: Date | undefined;
    let customEndDate: Date | undefined;
    if (startDate && endDate) {
      customStartDate = new Date(startDate as string);
      customEndDate = new Date(endDate as string);

      if (isNaN(customStartDate.getTime()) || isNaN(customEndDate.getTime())) {
        throw new AppError(
          400,
          "Invalid startDate or endDate format. Use YYYY-MM-DD."
        );
      }

      if (customStartDate > customEndDate) {
        throw new AppError(400, "startDate must be before endDate.");
      }
    } else if (startDate || endDate) {
      throw new AppError(
        400,
        "Both startDate and endDate must be provided for a custom range."
      );
    }

    const customerAnalytics = await this.analyticsService.getCustomerAnalytics({
      timePeriod: timePeriod as string,
      year: selectedYear,
      startDate: customStartDate,
      endDate: customEndDate,
    });

    sendResponse(res, 200, {
      data: customerAnalytics,
      message: "Customer analytics retrieved successfully",
    });
  });

  recordInteraction = asyncHandler(async (req: Request, res: Response) => {
    const { productId, type } = req.body;
    const userId = req.user?.id;

    const validTypes = ["view", "click", "wishlist", "cart_add", "other"];
    if (!type || !validTypes.includes(type)) {
      throw new AppError(
        400,
        "Invalid interaction type. Use: view, click, wishlist, cart_add, or other"
      );
    }

    await this.analyticsService.recordInteraction({
      userId: userId as string,
      productId,
      type,
    });

    await this.logsService.info("Recorded interaction", {
      userId,
      productId,
      type,
    });

    sendResponse(res, 200, {
      message: "Interaction recorded successfully",
    });
  });

  getInteractionAnalytics = asyncHandler(
    async (req: Request, res: Response) => {
      const { timePeriod, year, startDate, endDate } = req.query;
      const user = req.user;

      const validPeriods = [
        "last7days",
        "lastMonth",
        "lastYear",
        "allTime",
        "custom",
      ];
      if (!timePeriod || !validPeriods.includes(timePeriod as string)) {
        throw new AppError(
          400,
          "Invalid or missing timePeriod. Use: last7days, lastMonth, lastYear, allTime, or custom"
        );
      }

      let selectedYear: number | undefined;
      if (year) {
        selectedYear = parseInt(year as string, 10);
        if (isNaN(selectedYear)) {
          throw new AppError(400, "Invalid year format.");
        }
      }

      let customStartDate: Date | undefined;
      let customEndDate: Date | undefined;
      if (startDate && endDate) {
        customStartDate = new Date(startDate as string);
        customEndDate = new Date(endDate as string);

        if (
          isNaN(customStartDate.getTime()) ||
          isNaN(customEndDate.getTime())
        ) {
          throw new AppError(
            400,
            "Invalid startDate or endDate format. Use YYYY-MM-DD."
          );
        }

        if (customStartDate > customEndDate) {
          throw new AppError(400, "startDate must be before endDate.");
        }
      } else if (startDate || endDate) {
        throw new AppError(
          400,
          "Both startDate and endDate must be provided for a custom range."
        );
      }

      const analytics = await this.analyticsService.getInteractionAnalytics({
        timePeriod: timePeriod as string,
        year: selectedYear,
        startDate: customStartDate,
        endDate: customEndDate,
      });

      await this.logsService.info("Fetched interaction analytics", {
        userId: user?.id,
        timePeriod,
      });

      sendResponse(res, 200, {
        data: analytics,
        message: "Interaction analytics retrieved successfully",
      });
    }
  );

  getYearRange = asyncHandler(async (req: Request, res: Response) => {
    const yearRange = await this.analyticsService.getOrderYearRange();
    sendResponse(res, 200, {
      data: yearRange,
      message: "Year range retrieved successfully",
    });
  });

  exportAnalytics = asyncHandler(async (req: Request, res: Response) => {
    const { type, format, timePeriod, year, startDate, endDate } = req.query;

    // Validate format
    const validFormats = ["csv", "pdf", "xlsx"];
    if (!format || !validFormats.includes(format as string)) {
      throw new AppError(400, "Invalid format. Use: csv, pdf, or xlsx");
    }

    // Validate type
    const validTypes = ["overview", "products", "customers"];
    if (!type || !validTypes.includes(type as string)) {
      throw new AppError(
        400,
        "Invalid type. Use: overview, products, or customers"
      );
    }

    // Validate timePeriod
    const validPeriods = [
      "last7days",
      "lastMonth",
      "lastYear",
      "allTime",
      "custom",
    ];
    if (!timePeriod || !validPeriods.includes(timePeriod as string)) {
      throw new AppError(
        400,
        "Invalid or missing timePeriod. Use: last7days, lastMonth, lastYear, allTime, or custom"
      );
    }

    // Validate year if provided
    let selectedYear: number | undefined;
    if (year) {
      selectedYear = parseInt(year as string, 10);
      if (isNaN(selectedYear)) {
        throw new AppError(400, "Invalid year format.");
      }
    }

    // Validate custom date range
    let customStartDate: Date | undefined;
    let customEndDate: Date | undefined;
    if (startDate && endDate) {
      customStartDate = new Date(startDate as string);
      customEndDate = new Date(endDate as string);

      if (isNaN(customStartDate.getTime()) || isNaN(customEndDate.getTime())) {
        throw new AppError(
          400,
          "Invalid startDate or endDate format. Use YYYY-MM-DD."
        );
      }

      if (customStartDate > customEndDate) {
        throw new AppError(400, "startDate must be before endDate.");
      }
    } else if (startDate || endDate) {
      throw new AppError(
        400,
        "Both startDate and endDate must be provided for a custom range."
      );
    }

    const query: DateRangeQuery = {
      timePeriod: timePeriod as string,
      year: selectedYear,
      startDate: customStartDate,
      endDate: customEndDate,
    };

    let data: ExportableData;
    let filename: string;

    switch (type) {
      case "overview":
        data = await this.analyticsService.getAnalyticsOverview(query);
        filename = `analytics-overview-${new Date().toISOString()}.${format}`;
        break;
      case "products":
        data = await this.analyticsService.getProductPerformance(query);
        filename = `product-performance-${new Date().toISOString()}.${format}`;
        break;
      case "customers":
        data = await this.analyticsService.getCustomerAnalytics(query);
        filename = `customer-analytics-${new Date().toISOString()}.${format}`;
        break;
      default:
        throw new AppError(400, "Invalid analytics type");
    }

    let result: string | Buffer;
    let contentType: string;

    switch (format) {
      case "csv":
        result = this.exportUtils.generateCSV(data);
        contentType = "text/csv";
        break;
      case "pdf":
        result = this.exportUtils.generatePDF(data);
        contentType = "application/pdf";
        break;
      case "xlsx":
        result = await this.exportUtils.generateXLSX(data);
        contentType =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        break;
      default:
        throw new AppError(400, "Invalid format");
    }

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.send(result);
  });
}
