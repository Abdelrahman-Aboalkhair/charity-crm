import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define types based on your simplified Prisma schema
export interface Donor {
  id: string;
  name: string;
  gender: "MALE" | "FEMALE";
  phone_number1?: string;
  phone_number2?: string;
  dob?: string;
  email?: string;
  job_title?: string;
  province?: string;
  city?: string;
  area?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  location_id?: string;
}

export interface Donation {
  id: string;
  donor_id: string;
  location_id?: string;
  created_by_user_id?: string;
  date: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  notes?: string;
  createdAt: string;
  updatedAt: string;
  donor?: Donor;
  created_by_user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Call {
  id: string;
  donor_id: string;
  called_by_user_id: string;
  call_date: string;
  outcome: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  donor?: Donor;
  called_by_user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Reservation {
  id: string;
  donor_id: string;
  reserved_by_user_id: string;
  expires_at: string;
  status: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  donor?: Donor;
  reserved_by_user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Location {
  id: string;
  type: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// Create the API slice
export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1/",
    credentials: "include",
    prepareHeaders: (headers) => {
      // Add auth token if available
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Donor", "Donation", "Call", "Reservation", "Location"],
  endpoints: (builder) => ({
    // Donors
    getDonors: builder.query<{ donors: Donor[]; total: number }, { page?: number; limit?: number; search?: string }>({
      query: (params) => ({
        url: "donors",
        params,
      }),
      providesTags: ["Donor"],
    }),
    getDonorById: builder.query<Donor, string>({
      query: (id) => `donors/${id}`,
      providesTags: (result, error, id) => [{ type: "Donor", id }],
    }),
    createDonor: builder.mutation<Donor, Partial<Donor>>({
      query: (donor) => ({
        url: "donors",
        method: "POST",
        body: donor,
      }),
      invalidatesTags: ["Donor"],
    }),
    updateDonor: builder.mutation<Donor, { id: string; data: Partial<Donor> }>({
      query: ({ id, data }) => ({
        url: `donors/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Donor", id },
        "Donor",
      ],
    }),
    deleteDonor: builder.mutation<void, string>({
      query: (id) => ({
        url: `donors/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Donor"],
    }),

    // Donations
    getDonations: builder.query<{ donations: Donation[]; total: number }, { page?: number; limit?: number; donorId?: string }>({
      query: (params) => ({
        url: "donations",
        params,
      }),
      providesTags: ["Donation"],
    }),
    getDonationById: builder.query<Donation, string>({
      query: (id) => `donations/${id}`,
      providesTags: (result, error, id) => [{ type: "Donation", id }],
    }),
    createDonation: builder.mutation<Donation, Partial<Donation>>({
      query: (donation) => ({
        url: "donations",
        method: "POST",
        body: donation,
      }),
      invalidatesTags: ["Donation"],
    }),
    updateDonation: builder.mutation<
      Donation,
      { id: string; data: Partial<Donation> }
    >({
      query: ({ id, data }) => ({
        url: `donations/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Donation", id },
        "Donation",
      ],
    }),
    deleteDonation: builder.mutation<void, string>({
      query: (id) => ({
        url: `donations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Donation"],
    }),

    // Calls
    getCalls: builder.query<{ calls: Call[]; total: number }, { page?: number; limit?: number; donorId?: string; userId?: string }>({
      query: (params) => ({
        url: "calls",
        params,
      }),
      providesTags: ["Call"],
    }),
    getCallById: builder.query<Call, string>({
      query: (id) => `calls/${id}`,
      providesTags: (result, error, id) => [{ type: "Call", id }],
    }),
    createCall: builder.mutation<Call, Partial<Call>>({
      query: (call) => ({
        url: "calls",
        method: "POST",
        body: call,
      }),
      invalidatesTags: ["Call"],
    }),
    updateCall: builder.mutation<Call, { id: string; data: Partial<Call> }>({
      query: ({ id, data }) => ({
        url: `calls/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Call", id },
        "Call",
      ],
    }),
    deleteCall: builder.mutation<void, string>({
      query: (id) => ({
        url: `calls/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Call"],
    }),

    // Reservations
    getReservations: builder.query<{ reservations: Reservation[]; total: number }, { page?: number; limit?: number; donorId?: string; userId?: string }>({
      query: (params) => ({
        url: "reservations",
        params,
      }),
      providesTags: ["Reservation"],
    }),
    getReservationById: builder.query<Reservation, string>({
      query: (id) => `reservations/${id}`,
      providesTags: (result, error, id) => [{ type: "Reservation", id }],
    }),
    createReservation: builder.mutation<Reservation, Partial<Reservation>>({
      query: (reservation) => ({
        url: "reservations",
        method: "POST",
        body: reservation,
      }),
      invalidatesTags: ["Reservation"],
    }),
    updateReservation: builder.mutation<
      Reservation,
      { id: string; data: Partial<Reservation> }
    >({
      query: ({ id, data }) => ({
        url: `reservations/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Reservation", id },
        "Reservation",
      ],
    }),
    deleteReservation: builder.mutation<void, string>({
      query: (id) => ({
        url: `reservations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Reservation"],
    }),

    // Locations
    getLocations: builder.query<{ locations: Location[]; total: number }, { page?: number; limit?: number }>({
      query: (params) => ({
        url: "locations",
        params,
      }),
      providesTags: ["Location"],
    }),
    getLocationById: builder.query<Location, string>({
      query: (id) => `locations/${id}`,
      providesTags: (result, error, id) => [{ type: "Location", id }],
    }),
    createLocation: builder.mutation<Location, Partial<Location>>({
      query: (location) => ({
        url: "locations",
        method: "POST",
        body: location,
      }),
      invalidatesTags: ["Location"],
    }),
    updateLocation: builder.mutation<
      Location,
      { id: string; data: Partial<Location> }
    >({
      query: ({ id, data }) => ({
        url: `locations/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Location", id },
        "Location",
      ],
    }),
    deleteLocation: builder.mutation<void, string>({
      query: (id) => ({
        url: `locations/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Location"],
    }),
  }),
});

// Export hooks
export const {
  // Donors
  useGetDonorsQuery,
  useGetDonorByIdQuery,
  useCreateDonorMutation,
  useUpdateDonorMutation,
  useDeleteDonorMutation,

  // Donations
  useGetDonationsQuery,
  useGetDonationByIdQuery,
  useCreateDonationMutation,
  useUpdateDonationMutation,
  useDeleteDonationMutation,

  // Calls
  useGetCallsQuery,
  useGetCallByIdQuery,
  useCreateCallMutation,
  useUpdateCallMutation,
  useDeleteCallMutation,

  // Reservations
  useGetReservationsQuery,
  useGetReservationByIdQuery,
  useCreateReservationMutation,
  useUpdateReservationMutation,
  useDeleteReservationMutation,

  // Locations
  useGetLocationsQuery,
  useGetLocationByIdQuery,
  useCreateLocationMutation,
  useUpdateLocationMutation,
  useDeleteLocationMutation,
} = api;
