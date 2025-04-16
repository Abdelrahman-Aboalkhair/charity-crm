"use client";
import ProtectedRoute from "@/app/components/auth/ProtectedRoute";
import AreaChart from "@/app/components/charts/AreaChart";
import DonutChart from "@/app/components/charts/DonutChart";
import BarChart from "@/app/components/charts/BarChart";
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
} from "lucide-react";
import { motion } from "framer-motion";
import { Controller, useForm } from "react-hook-form";
import React from "react";
import useFormatPrice from "@/app/hooks/ui/useFormatPrice";
import {
  useGetOverviewQuery,
  useGetProductPerformanceQuery,
  useGetCustomerAnalyticsQuery,
  useGetYearRangeQuery,
} from "@/app/store/apis/AnalyticsApi";

interface FormData {
  timePeriod: string;
  year?: string;
  startDate?: string;
  endDate?: string;
  useCustomRange?: boolean;
}

const Dashboard = () => {
  const { control, watch } = useForm<FormData>({
    defaultValues: {
      timePeriod: "allTime",
      useCustomRange: false,
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

  // Fetch year range for dropdown
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

  // Fetch data
  const {
    data: overviewData,
    isLoading: isOverviewLoading,
    error: overviewError,
  } = useGetOverviewQuery(queryParams);
  console.log("overviewData => ", overviewData);

  const {
    data: productData,
    isLoading: isProductLoading,
    error: productError,
  } = useGetProductPerformanceQuery(queryParams);

  console.log("productData => ", productData);

  const {
    data: customerData,
    isLoading: isCustomerLoading,
    error: customerError,
  } = useGetCustomerAnalyticsQuery(queryParams);

  console.log("customerData => ", customerData);

  // Handle loading state
  if (isOverviewLoading || isProductLoading || isCustomerLoading) {
    return <div>Loading...</div>;
  }

  // Handle errors
  if (overviewError || productError || customerError) {
    console.error("Errors:", { overviewError, productError, customerError });
    return <div>Error loading dashboard data</div>;
  }

  // Derive chart and list data
  const mostSoldProducts = {
    labels: productData?.performance?.slice(0, 5).map((p) => p.name) || [],
    data: productData?.performance?.slice(0, 5).map((p) => p.quantity) || [],
  };

  const salesByProduct = {
    categories: productData?.performance?.map((p) => p.name) || [],
    data: productData?.performance?.map((p) => p.revenue) || [],
  };

  const topItems =
    productData?.performance?.slice(0, 5).map((p) => ({
      id: p.id,
      name: p.name,
      quantity: p.quantity,
      revenue: formatPrice(p.revenue),
    })) || [];

  const topCustomers =
    customerData?.topCustomers.slice(0, 5).map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      orderCount: c.orderCount,
      totalSpent: formatPrice(c.totalSpent),
    })) || [];

  return (
    <ProtectedRoute requiredRoles={["ADMIN", "SUPERADMIN"]}>
      <motion.div
        className="p-2 min-h-screen space-y-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Dashboard Overview</h1>
          <div className="flex items-center justify-center gap-2">
            <Controller
              name="timePeriod"
              control={control}
              render={({ field }) => (
                <Dropdown
                  onChange={field.onChange}
                  options={timePeriodOptions}
                  value={field.value}
                  label="Time Period"
                  className="min-w-[150px] w-full max-w-[200px]"
                />
              )}
            />
            {/* <Controller
              name="year"
              control={control}
              render={({ field }) => (
                <Dropdown
                  onChange={field.onChange}
                  options={yearOptions}
                  value={field.value}
                  label="Year"
                  className="min-w-[150px] w-full max-w-[200px]"
                  disabled={useCustomRange}
                />
              )}
            /> */}
            {/* <DateRangePicker
              label="Custom Date Range"
              control={control}
              startName="startDate"
              endName="endDate"
            /> */}
          </div>
        </div>
        <div className="flex gap-4">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AreaChart
            title="Order Analytics"
            data={overviewData?.monthlyTrends.orders || []}
            categories={overviewData?.monthlyTrends.labels || []}
            color="#ec4899"
            percentageChange={overviewData?.changes.orders}
          />
          <AreaChart
            title="Revenue Analytics"
            data={overviewData?.monthlyTrends.revenue || []}
            categories={overviewData?.monthlyTrends.labels || []}
            color="#22c55e"
            percentageChange={overviewData?.changes.revenue}
          />
          <AreaChart
            title="Sales Analytics"
            data={overviewData?.monthlyTrends.sales || []}
            categories={overviewData?.monthlyTrends.labels || []}
            color="#3b82f6"
            percentageChange={overviewData?.changes.sales}
          />
          <AreaChart
            title="User Analytics"
            data={overviewData?.monthlyTrends.users || []}
            categories={overviewData?.monthlyTrends.labels || []}
            color="#f59e0b"
            percentageChange={overviewData?.changes.users}
          />
          <DonutChart
            title="Most Sold Products"
            data={mostSoldProducts.data}
            labels={mostSoldProducts.labels}
          />
          <ListCard
            title="Top Customers"
            viewAllLink="/dashboard/users"
            items={topCustomers}
            itemType="user"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BarChart
            title="Sales by Product"
            data={salesByProduct.data}
            categories={salesByProduct.categories}
            color="#4CAF50"
          />
          <ListCard
            title="Top Items"
            viewAllLink="/shop"
            items={topItems}
            itemType="product"
          />
        </div>
      </motion.div>
    </ProtectedRoute>
  );
};

export default Dashboard;
