import { apiSlice } from "../slices/ApiSlice";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: () => ({
        url: "/users",
        credentials: "include",
      }),
      providesTags: ["User"],
    }),
    getAllAdmins: builder.query({
      query: () => ({
        url: "/users/admins",
        credentials: "include",
      }),
      providesTags: ["User"],
    }),
    getProfile: builder.query({
      query: (id) => ({
        url: `/users/profile/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["User"],
    }),
    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["User"],
    }),
    getMe: builder.query({
      query: () => ({
        url: "/users/me",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["User"],
    }),

    createAdmin: builder.mutation({
      query: (data) => ({
        url: "/users",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["User"],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetAllAdminsQuery,
  useUpdateUserMutation,
  useCreateAdminMutation,
  useDeleteUserMutation,
  useGetProfileQuery,
  useGetMeQuery,
  useGetAllUsersQuery,
  useLazyGetMeQuery,
} = userApi;
