"use client";
import ProtectedRoute from "@/app/components/auth/ProtectedRoute";
import AreaChart from "@/app/components/charts/AreaChart";
import BarChart from "@/app/components/charts/BarChart";
import DonutChart from "@/app/components/charts/DonutChart";
import ListCard from "@/app/components/organisms/ListCard";
import StatsCard from "@/app/components/organisms/StatsCard";
import Dropdown from "@/app/components/molecules/Dropdown";
import DateRangePicker from "@/app/components/molecules/DateRangePicker";
import {
  BarChart2,
  CreditCard,
  DollarSign,
  ShoppingCart,
  Users,
  Download,
} from "lucide-react";
import { motion } from "framer-motion";
import { Controller, useForm } from "react-hook-form";
import React, { useState } from "react";
import useFormatPrice from "@/app/hooks/ui/useFormatPrice";
import {
  useGetOverviewQuery,
  useGetProductPerformanceQuery,
  useGetCustomerAnalyticsQuery,
  useGetYearRangeQuery,
  useLazyExportAnalyticsQuery,
} from "@/app/store/apis/AnalyticsApi";

interface FormData {
  timePeriod: string;
  year?: string;
  startDate?: string;
  endDate?: string;
  useCustomRange: boolean;
}

const AnalyticsDashboard = () => {
  const { control, watch, setValue } = useForm<FormData>({
    defaultValues: {
      timePeriod: "allTime",
      useCustomRange: false,
      year: new Date().getFullYear().toString(),
    },
  });
  const formatPrice = useFormatPrice();

  const timePeriodOptions = [
    { label: "Last 7 Days", value: "last7days" },
    { label: "Last Month", value: "lastMonth" },
    { label: "Last Year", value: "lastYear" },
    { label: "All Time", value: "allTime" },
  ];

  const { timePeriod, year, startDate, endDate, useCustomRange } = watch();

  // Export state
  const [exportType, setExportType] = useState<string>("all");
  const [exportFormat, setExportFormat] = useState<string>("csv");

  // Fetch year range
  const { data: yearRangeData } = useGetYearRangeQuery();
  const minYear = yearRangeData?.minYear || new Date().getFullYear();
  const maxYear = yearRangeData?.maxYear || new Date().getFullYear();
  const yearOptions = Array.from({ length: maxYear - minYear + 1 }, (_, i) => ({
    label: (minYear + i).toString(),
    value: (minYear + i).toString(),
  }));

  // Query parameters
  const queryParams = {
    timePeriod: timePeriod || "allTime",
    year: useCustomRange ? undefined : year ? parseInt(year, 10) : undefined,
    startDate: useCustomRange && startDate ? startDate : undefined,
    endDate: useCustomRange && endDate ? endDate : undefined,
  };

  // Fetch analytics data
  const {
    data: overviewData,
    isLoading: isOverviewLoading,
    error: overviewError,
  } = useGetOverviewQuery(queryParams);

  const {
    data: productData,
    isLoading: isProductLoading,
    error: productError,
  } = useGetProductPerformanceQuery(queryParams);

  const {
    data: customerData,
    isLoading: isCustomerLoading,
    error: customerError,
  } = useGetCustomerAnalyticsQuery(queryParams);

  // Export query (triggered manually)
  const [
    triggerExport,
    { data: exportData, isLoading: isExporting, error: exportError },
  ] = useLazyExportAnalyticsQuery(
    {
      type: exportType || "pdf",
      format: exportFormat,
      timePeriod: queryParams.timePeriod,
      year: queryParams.year,
      startDate: queryParams.startDate,
      endDate: queryParams.endDate,
    },
    { skip: true }
  );

  console.log("exportData => ", exportData);
  console.log("exportError => ", exportError);

  // Handle export
  const handleExport = async () => {
    try {
      await triggerExport();
      if (exportData) {
        const mimeTypes: { [key: string]: string } = {
          csv: "text/csv",
          pdf: "application/pdf",
          xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        };
        const blob = new Blob([exportData], { type: mimeTypes[exportFormat] });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `analytics_${exportType}_${exportFormat}_${new Date().toISOString()}.${exportFormat}`;
        link.click();
      }
    } catch (err) {
      console.error("Export failed:", err);
      alert("Failed to export data");
    }
  };

  // Loading state
  if (isOverviewLoading || isProductLoading || isCustomerLoading) {
    return <div className="p-4">Loading...</div>;
  }

  // Error state
  if (overviewError || productError || customerError) {
    console.error("Errors:", { overviewError, productError, customerError });
    return <div className="p-4">Error loading analytics data</div>;
  }

  // Chart and list data
  const mostSoldProducts = {
    labels: productData?.performance?.slice(0, 10).map((p) => p.name) || [],
    data: productData?.performance?.slice(0, 10).map((p) => p.quantity) || [],
  };

  const salesByProduct = {
    categories: productData?.performance?.map((p) => p.name) || [],
    data: productData?.performance?.map((p) => p.revenue) || [],
  };

  const stockLevels = {
    categories: productData?.performance?.map((p) => p.name) || [],
    data: productData?.performance?.map((p) => p.stock) || [],
  };

  const topItems =
    productData?.performance?.slice(0, 10).map((p) => ({
      id: p.id,
      name: p.name,
      quantity: p.quantity,
      revenue: formatPrice(p.revenue),
      stock: p.stock,
    })) || [];

  const topCustomers =
    customerData?.topCustomers.slice(0, 10).map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      orderCount: c.orderCount,
      totalSpent: formatPrice(c.totalSpent),
    })) || [];

  const exportTypeOptions = [
    { label: "All Data", value: "all" },
    { label: "Overview", value: "overview" },
    { label: "Products", value: "products" },
    { label: "Customers", value: "customers" },
  ];

  const exportFormatOptions = [
    { label: "CSV", value: "csv" },
    { label: "PDF", value: "pdf" },
    { label: "XLSX", value: "xlsx" },
  ];

  return (
    <ProtectedRoute requiredRoles={["ADMIN", "SUPERADMIN"]}>
      <motion.div
        className="p-4 min-h-screen space-y-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Analytics Dashboard</h1>
          <div className="flex items-center gap-4">
            <Controller
              name="timePeriod"
              control={control}
              render={({ field }) => (
                <Dropdown
                  onChange={field.onChange}
                  options={timePeriodOptions}
                  value={field.value}
                  label="Time Period"
                  className="min-w-[150px] max-w-[200px]"
                />
              )}
            />
            <Controller
              name="year"
              control={control}
              render={({ field }) => (
                <Dropdown
                  onChange={field.onChange}
                  options={yearOptions}
                  value={field.value}
                  label="Year"
                  className="min-w-[150px] max-w-[200px]"
                  disabled={useCustomRange}
                />
              )}
            />
            <DateRangePicker
              label="Custom Date Range"
              control={control}
              startName="startDate"
              endName="endDate"
              onChange={(value) => setValue("useCustomRange", !!value)}
            />
            <Dropdown
              options={exportTypeOptions}
              value={exportType}
              onChange={(value) => setExportType(value)}
              label="Export Type"
              className="min-w-[150px] max-w-[200px]"
            />
            <Dropdown
              options={exportFormatOptions}
              value={exportFormat}
              onChange={(value) => setExportFormat(value)}
              label="Export Format"
              className="min-w-[150px] max-w-[200px]"
            />
            <button
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
              onClick={handleExport}
              disabled={isExporting}
            >
              <Download className="w-5 h-5" />
              {isExporting ? "Exporting..." : "Export"}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatsCard
            title="Total Revenue"
            value={formatPrice(overviewData?.totalRevenue || 0)}
            percentage={overviewData?.changes.revenue}
            caption="since last period"
            icon={<DollarSign className="w-5 h-5" />}
          />
          <StatsCard
            title="Total Orders"
            value={overviewData?.totalOrders || 0}
            percentage={overviewData?.changes.orders}
            caption="since last period"
            icon={<ShoppingCart className="w-5 h-5" />}
          />
          <StatsCard
            title="Total Sales"
            value={overviewData?.totalSales || 0}
            percentage={overviewData?.changes.sales}
            caption="since last period"
            icon={<BarChart2 className="w-5 h-5" />}
          />
          <StatsCard
            title="Average Order Value"
            value={formatPrice(overviewData?.averageOrderValue || 0)}
            percentage={overviewData?.changes.averageOrderValue}
            caption="since last period"
            icon={<CreditCard className="w-5 h-5" />}
          />
          <StatsCard
            title="Total Users"
            value={overviewData?.totalUsers || 0}
            percentage={overviewData?.changes.users}
            caption="since last period"
            icon={<Users className="w-5 h-5" />}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AreaChart
            title="Order Trends"
            data={overviewData?.monthlyTrends.orders || []}
            categories={overviewData?.monthlyTrends.labels || []}
            color="#ec4899"
            percentageChange={overviewData?.changes.orders}
          />
          <AreaChart
            title="Revenue Trends"
            data={overviewData?.monthlyTrends.revenue || []}
            categories={overviewData?.monthlyTrends.labels || []}
            color="#22c55e"
            percentageChange={overviewData?.changes.revenue}
          />
          <AreaChart
            title="Sales Trends"
            data={overviewData?.monthlyTrends.sales || []}
            categories={overviewData?.monthlyTrends.labels || []}
            color="#3b82f6"
            percentageChange={overviewData?.changes.sales}
          />
          <AreaChart
            title="User Trends"
            data={overviewData?.monthlyTrends.users || []}
            categories={overviewData?.monthlyTrends.labels || []}
            color="#f59e0b"
            percentageChange={overviewData?.changes.users}
          />
          <DonutChart
            title="Top 10 Products by Quantity"
            data={mostSoldProducts.data}
            labels={mostSoldProducts.labels}
          />
          <BarChart
            title="Stock Levels"
            data={stockLevels.data}
            categories={stockLevels.categories}
            color="#10b981"
          />
        </div>

        {/* Lists */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ListCard
            title="Top Products"
            viewAllLink="/shop"
            items={topItems}
            itemType="product"
          />
          <ListCard
            title="Top Customers"
            viewAllLink="/dashboard/users"
            items={topCustomers}
            itemType="user"
          />
          <BarChart
            title="Sales by Product"
            data={salesByProduct.data}
            categories={salesByProduct.categories}
            color="#4CAF50"
          />
        </div>
      </motion.div>
    </ProtectedRoute>
  );
};

export default AnalyticsDashboard;
