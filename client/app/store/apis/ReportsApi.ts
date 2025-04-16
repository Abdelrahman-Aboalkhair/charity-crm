import { apiSlice } from "../slices/ApiSlice";

export const reportsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    generateReport: builder.query<any, void>({
      query: () => ({
        url: "/reports/generate",
        method: "GET",
      }),
    }),
  }),
});

export const { useGenerateReportQuery } = reportsApi;
