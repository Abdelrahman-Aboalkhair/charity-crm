import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5000/api/v1",
  credentials: "include",
});

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["User", "Product", "Category", "Cart", "Order", "Review"],
  endpoints: () => ({}),
});
