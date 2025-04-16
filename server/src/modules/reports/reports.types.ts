// reports/reports.types.ts
export interface DateRangeQuery {
  timePeriod: string;
  year?: number;
  startDate?: Date;
  endDate?: Date;
}

export interface SalesReport {
  totalRevenue: number;
  totalOrders: number;
  totalSales: number;
  averageOrderValue: number;
  byCategory: {
    categoryId: string;
    categoryName: string;
    revenue: number;
    sales: number;
  }[];
  topProducts: {
    productId: string;
    productName: string;
    quantity: number;
    revenue: number;
  }[];
}

export interface CustomerRetentionReport {
  totalCustomers: number;
  retentionRate: number;
  repeatPurchaseRate: number;
  lifetimeValue: number;
  topCustomers: {
    customerId: string;
    name: string;
    email: string;
    orderCount: number;
    totalSpent: number;
  }[];
}

export type ReportData = SalesReport | CustomerRetentionReport;
