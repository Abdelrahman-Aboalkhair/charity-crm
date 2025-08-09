import { apiSlice } from "../slices/ApiSlice";

export const logsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLogs: builder.query({
      query: () => "/logs",
    }),
  }),
});

export const { useGetLogsQuery } = logsApi;
