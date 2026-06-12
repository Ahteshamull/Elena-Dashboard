import { apiSlice } from './apiSlice';

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsersByRole: builder.query({
      query: (role) => `/user/all-users/${role}`,
      providesTags: ['User'],
    }),
    getUserById: builder.query({
      query: (id) => `/user/single-user/${id}`,
      providesTags: ['User'],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/user/delete-user/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
    blockUser: builder.mutation({
      query: (id) => ({
        url: `/user/block-user/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const { 
  useGetAllUsersByRoleQuery,
  useGetUserByIdQuery,
  useDeleteUserMutation,
  useBlockUserMutation
} = userApiSlice;