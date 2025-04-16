import * as csv from "csv-stringify/sync";
import PDFDocument from "pdfkit";
import ExcelJS from "exceljs";
import {
  AnalyticsOverview,
  ProductPerformance,
  CustomerAnalytics,
} from "@/modules/analytics/analytics.types";
import {
  ReportData,
  SalesReport,
  CustomerRetentionReport,
} from "@/modules/reports/reports.types";

type ExportableData =
  | AnalyticsOverview
  | ProductPerformance[]
  | CustomerAnalytics
  | ReportData;

export class ExportUtils {
  private flattenObject(obj: any, prefix: string = ""): any {
    return Object.keys(obj).reduce((acc, key) => {
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (
        typeof obj[key] === "object" &&
        obj[key] !== null &&
        !Array.isArray(obj[key])
      ) {
        return { ...acc, ...this.flattenObject(obj[key], newKey) };
      } else if (Array.isArray(obj[key])) {
        acc[newKey] = JSON.stringify(obj[key]);
      } else {
        acc[newKey] = obj[key];
      }
      return acc;
    }, {} as any);
  }

  private formatAnalyticsData(data: ExportableData): any[] {
    if (Array.isArray(data)) {
      // Handle ProductPerformance[]
      return data.map((item) => this.flattenObject(item));
    } else if ("totalCustomers" in data && "topCustomers" in data) {
      // Handle CustomerAnalytics
      const { topCustomers, ...rest } = data;
      const flattenedRest = this.flattenObject(rest);
      return [
        flattenedRest,
        ...topCustomers.map((customer, index) => ({
          topCustomerRank: index + 1,
          ...this.flattenObject(customer),
        })),
      ];
    } else if ("totalRevenue" in data && "byCategory" in data) {
      // Handle SalesReport
      const { byCategory, topProducts, ...rest } = data as SalesReport;
      const flattenedRest = this.flattenObject(rest);
      return [
        flattenedRest,
        ...byCategory.map((cat, index) => ({
          categoryRank: index + 1,
          ...this.flattenObject(cat),
        })),
        ...topProducts.map((prod, index) => ({
          productRank: index + 1,
          ...this.flattenObject(prod),
        })),
      ];
    } else if (
      "totalCustomers" in data &&
      "retentionRate" in data &&
      "repeatPurchaseRate" in data &&
      "lifetimeValue" in data &&
      "topCustomers" in data
    ) {
      const { topCustomers, ...rest } = data as CustomerRetentionReport;
      const flattenedRest = this.flattenObject(rest);
      return [
        flattenedRest,
        ...topCustomers.map((customer, index) => ({
          topCustomerRank: index + 1,
          ...this.flattenObject(customer),
        })),
      ];
    } else {
      // Handle AnalyticsOverview
      return [this.flattenObject(data)];
    }
  }

  generateCSV(data: ExportableData): string {
    const formattedData = this.formatAnalyticsData(data);
    return csv.stringify(formattedData, {
      header: true,
      quoted: true,
      quoted_empty: true,
    });
  }

  generatePDF(data: ExportableData): Buffer {
    const doc = new PDFDocument({ margin: 50 });
    const buffers: Buffer[] = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {});

    // Header
    doc
      .fontSize(16)
      .font("Helvetica-Bold")
      .text("Report", { align: "center" })
      .moveDown(1);

    if (Array.isArray(data)) {
      // ProductPerformance
      doc
        .fontSize(12)
        .font("Helvetica")
        .text("Product Performance", { underline: true })
        .moveDown(0.5);
      data.forEach((item, index) => {
        doc
          .fontSize(10)
          .text(`Product ${index + 1}: ${item.name}`)
          .text(`ID: ${item.id}`)
          .text(`Quantity Sold: ${item.quantity}`)
          .text(`Revenue: $${item.revenue.toFixed(2)}`)
          .moveDown(0.5);
      });
    } else if (
      "totalCustomers" in data &&
      "topCustomers" in data &&
      "engagementScore" in data
    ) {
      // CustomerAnalytics
      const {
        totalCustomers,
        retentionRate,
        lifetimeValue,
        repeatPurchaseRate,
        engagementScore,
        topCustomers,
      } = data;
      doc
        .fontSize(12)
        .font("Helvetica")
        .text("Customer Analytics", { underline: true })
        .moveDown(0.5);
      doc
        .fontSize(10)
        .text(`Total Customers: ${totalCustomers}`)
        .text(`Retention Rate: ${retentionRate.toFixed(2)}%`)
        .text(`Average Lifetime Value: $${lifetimeValue.toFixed(2)}`)
        .text(`Repeat Purchase Rate: ${repeatPurchaseRate.toFixed(2)}%`)
        .text(`Average Engagement Score: ${engagementScore.toFixed(2)}`)
        .moveDown(1);

      doc.fontSize(12).text("Top Customers", { underline: true }).moveDown(0.5);
      topCustomers.forEach((customer, index) => {
        doc
          .fontSize(10)
          .text(`Customer ${index + 1}: ${customer.name}`)
          .text(`Email: ${customer.email}`)
          .text(`Orders: ${customer.orderCount}`)
          .text(`Total Spent: $${customer.totalSpent.toFixed(2)}`)
          .text(`Engagement Score: ${customer.engagementScore.toFixed(2)}`)
          .moveDown(0.5);
      });
    } else if ("totalRevenue" in data && "byCategory" in data) {
      // SalesReport
      const {
        totalRevenue,
        totalOrders,
        totalSales,
        averageOrderValue,
        byCategory,
        topProducts,
      } = data as SalesReport;
      doc
        .fontSize(12)
        .font("Helvetica")
        .text("Sales Report", { underline: true })
        .moveDown(0.5);
      doc
        .fontSize(10)
        .text(`Total Revenue: $${totalRevenue.toFixed(2)}`)
        .text(`Total Orders: ${totalOrders}`)
        .text(`Total Sales: ${totalSales}`)
        .text(`Average Order Value: $${averageOrderValue.toFixed(2)}`)
        .moveDown(1);

      doc
        .fontSize(12)
        .text("Sales by Category", { underline: true })
        .moveDown(0.5);
      byCategory.forEach((cat, index) => {
        doc
          .fontSize(10)
          .text(`Category ${index + 1}: ${cat.categoryName}`)
          .text(`Revenue: $${cat.revenue.toFixed(2)}`)
          .text(`Sales: ${cat.sales}`)
          .moveDown(0.5);
      });

      doc.fontSize(12).text("Top Products", { underline: true }).moveDown(0.5);
      topProducts.forEach((prod, index) => {
        doc
          .fontSize(10)
          .text(`Product ${index + 1}: ${prod.productName}`)
          .text(`ID: ${prod.productId}`)
          .text(`Quantity: ${prod.quantity}`)
          .text(`Revenue: $${prod.revenue.toFixed(2)}`)
          .moveDown(0.5);
      });
    } else if ("totalCustomers" in data && "retentionRate" in data) {
      // CustomerRetentionReport
      const {
        totalCustomers,
        retentionRate,
        repeatPurchaseRate,
        lifetimeValue,
        topCustomers,
      } = data as CustomerRetentionReport;
      doc
        .fontSize(12)
        .font("Helvetica")
        .text("Customer Retention Report", { underline: true })
        .moveDown(0.5);
      doc
        .fontSize(10)
        .text(`Total Customers: ${totalCustomers}`)
        .text(`Retention Rate: ${retentionRate.toFixed(2)}%`)
        .text(`Repeat Purchase Rate: ${repeatPurchaseRate.toFixed(2)}%`)
        .text(`Average Lifetime Value: $${lifetimeValue.toFixed(2)}`)
        .moveDown(1);

      doc.fontSize(12).text("Top Customers", { underline: true }).moveDown(0.5);
      topCustomers.forEach((customer, index) => {
        doc
          .fontSize(10)
          .text(`Customer ${index + 1}: ${customer.name}`)
          .text(`Email: ${customer.email}`)
          .text(`Orders: ${customer.orderCount}`)
          .text(`Total Spent: $${customer.totalSpent.toFixed(2)}`)
          .moveDown(0.5);
      });
    } else {
      // AnalyticsOverview
      const {
        totalRevenue,
        totalOrders,
        totalSales,
        totalUsers,
        averageOrderValue,
        changes,
        monthlyTrends,
      } = data as AnalyticsOverview;
      doc
        .fontSize(12)
        .font("Helvetica")
        .text("Analytics Overview", { underline: true })
        .moveDown(0.5);
      doc
        .fontSize(10)
        .text(`Total Revenue: $${totalRevenue.toFixed(2)}`)
        .text(`Total Orders: ${totalOrders}`)
        .text(`Total Sales: ${totalSales}`)
        .text(`Total Users: ${totalUsers}`)
        .text(`Average Order Value: $${averageOrderValue.toFixed(2)}`)
        .moveDown(0.5);

      doc.fontSize(12).text("Changes", { underline: true }).moveDown(0.5);
      doc
        .fontSize(10)
        .text(
          `Revenue Change: ${
            changes.revenue ? changes.revenue.toFixed(2) + "%" : "N/A"
          }`
        )
        .text(
          `Orders Change: ${
            changes.orders ? changes.orders.toFixed(2) + "%" : "N/A"
          }`
        )
        .text(
          `Sales Change: ${
            changes.sales ? changes.sales.toFixed(2) + "%" : "N/A"
          }`
        )
        .text(
          `Users Change: ${
            changes.users ? changes.users.toFixed(2) + "%" : "N/A"
          }`
        )
        .text(
          `AOV Change: ${
            changes.averageOrderValue
              ? changes.averageOrderValue.toFixed(2) + "%"
              : "N/A"
          }`
        )
        .moveDown(0.5);

      doc
        .fontSize(12)
        .text("Monthly Trends", { underline: true })
        .moveDown(0.5);
      monthlyTrends.labels.forEach((label, index) => {
        doc
          .fontSize(10)
          .text(`${label}:`)
          .text(`  Revenue: $${monthlyTrends.revenue[index].toFixed(2)}`)
          .text(`  Orders: ${monthlyTrends.orders[index]}`)
          .text(`  Sales: ${monthlyTrends.sales[index]}`)
          .text(`  Users: ${monthlyTrends.users[index]}`)
          .moveDown(0.5);
      });
    }

    doc.end();
    return Buffer.concat(buffers);
  }

  async generateXLSX(data: ExportableData): Promise<any> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Report");

    if (Array.isArray(data)) {
      // ProductPerformance
      worksheet.columns = [
        { header: "ID", key: "id", width: 30 },
        { header: "Product Name", key: "name", width: 30 },
        { header: "Quantity Sold", key: "quantity", width: 15 },
        { header: "Revenue", key: "revenue", width: 15 },
      ];
      data.forEach((item) => {
        worksheet.addRow({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          revenue: item.revenue,
        });
      });
    } else if (
      "totalCustomers" in data &&
      "topCustomers" in data &&
      "engagementScore" in data
    ) {
      // CustomerAnalytics
      const {
        totalCustomers,
        retentionRate,
        lifetimeValue,
        repeatPurchaseRate,
        engagementScore,
        topCustomers,
      } = data;
      worksheet.columns = [
        { header: "Metric", key: "metric", width: 30 },
        { header: "Value", key: "value", width: 20 },
      ];
      worksheet.addRows([
        { metric: "Total Customers", value: totalCustomers },
        { metric: "Retention Rate (%)", value: retentionRate },
        { metric: "Average Lifetime Value ($)", value: lifetimeValue },
        { metric: "Repeat Purchase Rate (%)", value: repeatPurchaseRate },
        { metric: "Average Engagement Score", value: engagementScore },
      ]);

      worksheet.addRow([]); // Spacer
      worksheet.addRow(["Top Customers"]);
      worksheet.addRow([
        "Rank",
        "Name",
        "Email",
        "Order Count",
        "Total Spent",
        "Engagement Score",
      ]);
      topCustomers.forEach((customer, index) => {
        worksheet.addRow([
          index + 1,
          customer.name,
          customer.email,
          customer.orderCount,
          customer.totalSpent,
          customer.engagementScore,
        ]);
      });
    } else if ("totalRevenue" in data && "byCategory" in data) {
      // SalesReport
      const {
        totalRevenue,
        totalOrders,
        totalSales,
        averageOrderValue,
        byCategory,
        topProducts,
      } = data as SalesReport;
      worksheet.columns = [
        { header: "Metric", key: "metric", width: 30 },
        { header: "Value", key: "value", width: 20 },
      ];
      worksheet.addRows([
        { metric: "Total Revenue ($)", value: totalRevenue },
        { metric: "Total Orders", value: totalOrders },
        { metric: "Total Sales", value: totalSales },
        { metric: "Average Order Value ($)", value: averageOrderValue },
      ]);

      worksheet.addRow([]); // Spacer
      worksheet.addRow(["Sales by Category"]);
      worksheet.addRow([
        "Category ID",
        "Category Name",
        "Revenue ($)",
        "Sales",
      ]);
      byCategory.forEach((cat) => {
        worksheet.addRow([
          cat.categoryId,
          cat.categoryName,
          cat.revenue,
          cat.sales,
        ]);
      });

      worksheet.addRow([]); // Spacer
      worksheet.addRow(["Top Products"]);
      worksheet.addRow([
        "Product ID",
        "Product Name",
        "Quantity",
        "Revenue ($)",
      ]);
      topProducts.forEach((prod) => {
        worksheet.addRow([
          prod.productId,
          prod.productName,
          prod.quantity,
          prod.revenue,
        ]);
      });
    } else if ("totalCustomers" in data && "retentionRate" in data) {
      // CustomerRetentionReport
      const {
        totalCustomers,
        retentionRate,
        repeatPurchaseRate,
        lifetimeValue,
        topCustomers,
      } = data as CustomerRetentionReport;
      worksheet.columns = [
        { header: "Metric", key: "metric", width: 30 },
        { header: "Value", key: "value", width: 20 },
      ];
      worksheet.addRows([
        { metric: "Total Customers", value: totalCustomers },
        { metric: "Retention Rate (%)", value: retentionRate },
        { metric: "Repeat Purchase Rate (%)", value: repeatPurchaseRate },
        { metric: "Average Lifetime Value ($)", value: lifetimeValue },
      ]);

      worksheet.addRow([]); // Spacer
      worksheet.addRow(["Top Customers"]);
      worksheet.addRow([
        "Rank",
        "Customer ID",
        "Name",
        "Email",
        "Order Count",
        "Total Spent",
      ]);
      topCustomers.forEach((customer, index) => {
        worksheet.addRow([
          index + 1,
          customer.customerId,
          customer.name,
          customer.email,
          customer.orderCount,
          customer.totalSpent,
        ]);
      });
    } else {
      // AnalyticsOverview
      const {
        totalRevenue,
        totalOrders,
        totalSales,
        totalUsers,
        averageOrderValue,
        changes,
        monthlyTrends,
      } = data as AnalyticsOverview;
      worksheet.columns = [
        { header: "Metric", key: "metric", width: 30 },
        { header: "Value", key: "value", width: 20 },
      ];
      worksheet.addRows([
        { metric: "Total Revenue ($)", value: totalRevenue },
        { metric: "Total Orders", value: totalOrders },
        { metric: "Total Sales", value: totalSales },
        { metric: "Total Users", value: totalUsers },
        { metric: "Average Order Value ($)", value: averageOrderValue },
      ]);

      worksheet.addRow([]); // Spacer
      worksheet.addRow(["Changes"]);
      worksheet.addRows([
        { metric: "Revenue Change (%)", value: changes.revenue || "N/A" },
        { metric: "Orders Change (%)", value: changes.orders || "N/A" },
        { metric: "Sales Change (%)", value: changes.sales || "N/A" },
        { metric: "Users Change (%)", value: changes.users || "N/A" },
        { metric: "AOV Change (%)", value: changes.averageOrderValue || "N/A" },
      ]);

      worksheet.addRow([]); // Spacer
      worksheet.addRow(["Monthly Trends"]);
      worksheet.addRow(["Month", "Revenue ($)", "Orders", "Sales", "Users"]);
      monthlyTrends.labels.forEach((label, index) => {
        worksheet.addRow([
          label,
          monthlyTrends.revenue[index],
          monthlyTrends.orders[index],
          monthlyTrends.sales[index],
          monthlyTrends.users[index],
        ]);
      });
    }

    // Styling
    worksheet.getRow(1).font = { bold: true };
    worksheet.eachRow((row) => {
      row.alignment = { vertical: "middle", horizontal: "left" };
    });

    return workbook.xlsx.writeBuffer();
  }
}
