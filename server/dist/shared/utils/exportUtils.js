"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExportUtils = void 0;
const csv = __importStar(require("csv-stringify/sync"));
const pdfkit_1 = __importDefault(require("pdfkit"));
const exceljs_1 = __importDefault(require("exceljs"));
class ExportUtils {
    flattenObject(obj, prefix = "") {
        return Object.keys(obj).reduce((acc, key) => {
            const newKey = prefix ? `${prefix}.${key}` : key;
            if (typeof obj[key] === "object" &&
                obj[key] !== null &&
                !Array.isArray(obj[key])) {
                return Object.assign(Object.assign({}, acc), this.flattenObject(obj[key], newKey));
            }
            else if (Array.isArray(obj[key])) {
                acc[newKey] = JSON.stringify(obj[key]);
            }
            else {
                acc[newKey] = obj[key];
            }
            return acc;
        }, {});
    }
    formatAnalyticsData(data) {
        if (Array.isArray(data)) {
            // Handle ProductPerformance[]
            return data.map((item) => this.flattenObject(item));
        }
        else if ("totalCustomers" in data && "topCustomers" in data) {
            // Handle CustomerAnalytics
            const { topCustomers } = data, rest = __rest(data, ["topCustomers"]);
            const flattenedRest = this.flattenObject(rest);
            return [
                flattenedRest,
                ...topCustomers.map((customer, index) => (Object.assign({ topCustomerRank: index + 1 }, this.flattenObject(customer)))),
            ];
        }
        else if ("totalRevenue" in data && "byCategory" in data) {
            // Handle SalesReport
            const _a = data, { byCategory, topProducts } = _a, rest = __rest(_a, ["byCategory", "topProducts"]);
            const flattenedRest = this.flattenObject(rest);
            return [
                flattenedRest,
                ...byCategory.map((cat, index) => (Object.assign({ categoryRank: index + 1 }, this.flattenObject(cat)))),
                ...topProducts.map((prod, index) => (Object.assign({ productRank: index + 1 }, this.flattenObject(prod)))),
            ];
        }
        else if ("totalCustomers" in data &&
            "retentionRate" in data &&
            "repeatPurchaseRate" in data &&
            "lifetimeValue" in data &&
            "topCustomers" in data) {
            const _b = data, { topCustomers } = _b, rest = __rest(_b, ["topCustomers"]);
            const flattenedRest = this.flattenObject(rest);
            return [
                flattenedRest,
                ...topCustomers.map((customer, index) => (Object.assign({ topCustomerRank: index + 1 }, this.flattenObject(customer)))),
            ];
        }
        else {
            // Handle AnalyticsOverview
            return [this.flattenObject(data)];
        }
    }
    generateCSV(data) {
        const formattedData = this.formatAnalyticsData(data);
        return csv.stringify(formattedData, {
            header: true,
            quoted: true,
            quoted_empty: true,
        });
    }
    generatePDF(data) {
        const doc = new pdfkit_1.default({ margin: 50 });
        const buffers = [];
        doc.on("data", buffers.push.bind(buffers));
        doc.on("end", () => { });
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
        }
        else if ("totalCustomers" in data &&
            "topCustomers" in data &&
            "engagementScore" in data) {
            // CustomerAnalytics
            const { totalCustomers, retentionRate, lifetimeValue, repeatPurchaseRate, engagementScore, topCustomers, } = data;
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
        }
        else if ("totalRevenue" in data && "byCategory" in data) {
            // SalesReport
            const { totalRevenue, totalOrders, totalSales, averageOrderValue, byCategory, topProducts, } = data;
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
        }
        else if ("totalCustomers" in data && "retentionRate" in data) {
            // CustomerRetentionReport
            const { totalCustomers, retentionRate, repeatPurchaseRate, lifetimeValue, topCustomers, } = data;
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
        }
        else {
            // AnalyticsOverview
            const { totalRevenue, totalOrders, totalSales, totalUsers, averageOrderValue, changes, monthlyTrends, } = data;
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
                .text(`Revenue Change: ${changes.revenue ? changes.revenue.toFixed(2) + "%" : "N/A"}`)
                .text(`Orders Change: ${changes.orders ? changes.orders.toFixed(2) + "%" : "N/A"}`)
                .text(`Sales Change: ${changes.sales ? changes.sales.toFixed(2) + "%" : "N/A"}`)
                .text(`Users Change: ${changes.users ? changes.users.toFixed(2) + "%" : "N/A"}`)
                .text(`AOV Change: ${changes.averageOrderValue
                ? changes.averageOrderValue.toFixed(2) + "%"
                : "N/A"}`)
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
    generateXLSX(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const workbook = new exceljs_1.default.Workbook();
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
            }
            else if ("totalCustomers" in data &&
                "topCustomers" in data &&
                "engagementScore" in data) {
                // CustomerAnalytics
                const { totalCustomers, retentionRate, lifetimeValue, repeatPurchaseRate, engagementScore, topCustomers, } = data;
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
            }
            else if ("totalRevenue" in data && "byCategory" in data) {
                // SalesReport
                const { totalRevenue, totalOrders, totalSales, averageOrderValue, byCategory, topProducts, } = data;
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
            }
            else if ("totalCustomers" in data && "retentionRate" in data) {
                // CustomerRetentionReport
                const { totalCustomers, retentionRate, repeatPurchaseRate, lifetimeValue, topCustomers, } = data;
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
            }
            else {
                // AnalyticsOverview
                const { totalRevenue, totalOrders, totalSales, totalUsers, averageOrderValue, changes, monthlyTrends, } = data;
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
        });
    }
}
exports.ExportUtils = ExportUtils;
