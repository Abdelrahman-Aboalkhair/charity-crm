import { subDays, subMonths, subYears, startOfYear, endOfYear } from "date-fns";
import redisClient from "@/infra/cache/redis";
import { ReportsRepository } from "./reports.repository";
import { AnalyticsRepository } from "../analytics/analytics.repository";
import { ProductRepository } from "../product/product.repository";
import {
  DateRangeQuery,
  SalesReport,
  CustomerRetentionReport,
} from "./reports.types";
import { PrismaClient } from "@prisma/client";

export class ReportsService {
  private prisma: PrismaClient;

  constructor(
    private reportsRepository: ReportsRepository,
    private analyticsRepository: AnalyticsRepository,
    private productRepository: ProductRepository
  ) {
    this.prisma = new PrismaClient();
  }

  async generateSalesReport(query: DateRangeQuery): Promise<SalesReport> {
    const { timePeriod, year, startDate, endDate } = query;
    const cacheKey = `reports:sales:${timePeriod}:${year || "all"}:${
      startDate?.toISOString() || "none"
    }:${endDate?.toISOString() || "none"}`;
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const now = new Date();
    let currentStartDate: Date | undefined;
    let yearStart: Date | undefined;
    let yearEnd: Date | undefined;

    if (year) {
      yearStart = startOfYear(new Date(year, 0, 1));
      yearEnd = endOfYear(new Date(year, 0, 1));
    }

    if (startDate && endDate) {
      currentStartDate = startDate;
    } else {
      switch (timePeriod) {
        case "last7days":
          currentStartDate = subDays(now, 7);
          break;
        case "lastMonth":
          currentStartDate = subMonths(now, 1);
          break;
        case "lastYear":
          currentStartDate = subYears(now, 1);
          break;
        case "allTime":
          currentStartDate = undefined;
          break;
        case "custom":
          throw new Error("Custom time period requires startDate and endDate");
      }
    }

    const orders = await this.analyticsRepository.getOrdersByTimePeriod(
      currentStartDate,
      endDate,
      yearStart,
      yearEnd
    );
    const orderItems = await this.analyticsRepository.getOrderItemsByTimePeriod(
      currentStartDate,
      endDate,
      yearStart,
      yearEnd
    );

    // Core Metrics
    const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
    const totalOrders = orders.length;
    const totalSales = orderItems.reduce((sum, item) => sum + item.quantity, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // By Category
    const categorySales: {
      [key: string]: { revenue: number; sales: number; name: string };
    } = {};

    for (const item of orderItems) {
      const product = await this.productRepository.findProductById(
        item.productId
      );
      const categoryId = product?.categoryId || "uncategorized";
      const categoryName = product?.category?.name || "Uncategorized";
      if (!categorySales[categoryId]) {
        categorySales[categoryId] = {
          revenue: 0,
          sales: 0,
          name: categoryName,
        };
      }
      categorySales[categoryId].revenue +=
        item.quantity * (item.product.price || 0);
      categorySales[categoryId].sales += item.quantity;
    }
    // Transform the categorySales object into an array: [{ categoryId, categoryName, revenue, sales }]
    const byCategory = Object.entries(categorySales).map(
      ([categoryId, data]) => ({
        categoryId,
        categoryName: data.name,
        revenue: data.revenue,
        sales: data.sales,
      })
    );

    // Top Products
    const productSales: {
      [key: string]: {
        productId: string;
        productName: string;
        quantity: number;
        revenue: number;
      };
    } = {};
    for (const item of orderItems) {
      const productId = item.productId;
      if (!productSales[productId]) {
        const product = await this.productRepository.findProductById(productId);
        productSales[productId] = {
          productId,
          productName: product?.name || "Unknown",
          quantity: 0,
          revenue: 0,
        };
      }
      productSales[productId].quantity += item.quantity;
      productSales[productId].revenue +=
        item.quantity * (item.product.price || 0);
    }
    const topProducts = Object.values(productSales)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    const result: SalesReport = {
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalOrders,
      totalSales,
      averageOrderValue: Number(averageOrderValue.toFixed(2)),
      byCategory,
      topProducts,
    };

    await redisClient.setex(cacheKey, 300, JSON.stringify(result));
    return result;
  }

  async generateCustomerRetentionReport(
    query: DateRangeQuery
  ): Promise<CustomerRetentionReport> {
    const { timePeriod, year, startDate, endDate } = query;
    const cacheKey = `reports:customer_retention:${timePeriod}:${
      year || "all"
    }:${startDate?.toISOString() || "none"}:${
      endDate?.toISOString() || "none"
    }`;
    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const now = new Date();
    let currentStartDate: Date | undefined;
    let previousStartDate: Date | undefined;
    let previousEndDate: Date | undefined;
    let yearStart: Date | undefined;
    let yearEnd: Date | undefined;

    if (year) {
      yearStart = startOfYear(new Date(year, 0, 1));
      yearEnd = endOfYear(new Date(year, 0, 1));
    }

    if (startDate && endDate) {
      currentStartDate = startDate;
      previousStartDate = undefined;
    } else {
      switch (timePeriod) {
        case "last7days":
          currentStartDate = subDays(now, 7);
          previousStartDate = subDays(now, 14);
          previousEndDate = subDays(now, 7);
          break;
        case "lastMonth":
          currentStartDate = subMonths(now, 1);
          previousStartDate = subMonths(now, 2);
          previousEndDate = subMonths(now, 1);
          break;
        case "lastYear":
          currentStartDate = subYears(now, 1);
          previousStartDate = subYears(now, 2);
          previousEndDate = subYears(now, 1);
          break;
        case "allTime":
          currentStartDate = undefined;
          previousStartDate = undefined;
          previousEndDate = undefined;
          break;
        case "custom":
          throw new Error("Custom time period requires startDate and endDate");
      }
    }

    const users = await this.analyticsRepository.getUsersByTimePeriod(
      currentStartDate,
      endDate,
      yearStart,
      yearEnd
    );

    const totalCustomers = users.length;

    // Retention Rate
    let retentionRate = 0;
    if (
      timePeriod !== "allTime" &&
      timePeriod !== "custom" &&
      previousStartDate &&
      previousEndDate
    ) {
      const previousUsers = await this.analyticsRepository.getUsersByTimePeriod(
        previousStartDate,
        previousEndDate,
        yearStart,
        yearEnd
      );
      const previousUserIds = new Set(previousUsers.map((user) => user.id));
      const retainedCustomers = users.filter(
        (user) => previousUserIds.has(user.id) && user.orders.length > 0
      ).length;
      retentionRate =
        previousUsers.length > 0
          ? (retainedCustomers / previousUsers.length) * 100
          : 0;
    }

    // Lifetime Value
    const totalRevenue = users.reduce((sum, user) => {
      const userRevenue = user.orders.reduce(
        (orderSum, order) => orderSum + order.amount,
        0
      );
      return sum + userRevenue;
    }, 0);
    const lifetimeValue =
      totalCustomers > 0 ? totalRevenue / totalCustomers : 0;

    // Repeat Purchase Rate
    const repeatCustomers = users.filter(
      (user) => user.orders.length > 1
    ).length;
    const repeatPurchaseRate =
      totalCustomers > 0 ? (repeatCustomers / totalCustomers) * 100 : 0;

    // Top Customers
    const topCustomers = users
      .map((user) => ({
        customerId: user.id,
        name: user.name || "Unknown",
        email: user.email,
        orderCount: user.orders.length,
        totalSpent: user.orders.reduce((sum, order) => sum + order.amount, 0),
      }))
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5);

    const result: CustomerRetentionReport = {
      totalCustomers,
      retentionRate: Number(retentionRate.toFixed(2)),
      repeatPurchaseRate: Number(repeatPurchaseRate.toFixed(2)),
      lifetimeValue: Number(lifetimeValue.toFixed(2)),
      topCustomers,
    };

    await redisClient.setex(cacheKey, 300, JSON.stringify(result));
    return result;
  }

  async logReport(data: {
    type: string;
    format: string;
    userId?: string;
    parameters: DateRangeQuery;
  }) {
    await this.reportsRepository.createReport({
      type: data.type,
      format: data.format,
      userId: data.userId ?? "",
      parameters: data.parameters,
      filePath: null,
    });
  }
}
