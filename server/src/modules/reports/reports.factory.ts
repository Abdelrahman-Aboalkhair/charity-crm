import { ReportsRepository } from "./reports.repository";
import { ReportsService } from "./reports.service";
import { ReportsController } from "./reports.controller";
import { AnalyticsRepository } from "../analytics/analytics.repository";
import { ProductRepository } from "../product/product.repository";
import { ExportUtils } from "@/shared/utils/exportUtils";

export const makeReportsController = () => {
  const reportsRepo = new ReportsRepository();
  const analyticsRepo = new AnalyticsRepository();
  const productRepo = new ProductRepository();
  const service = new ReportsService(reportsRepo, analyticsRepo, productRepo);
  const exportUtils = new ExportUtils();
  return new ReportsController(service, exportUtils);
};
