import { apiSlice } from './apiSlice';

export const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminOverview: builder.query({
      query: () => '/admin/overview',
      providesTags: ['AdminOverview'],
    }),
  }),
});

export const { useGetAdminOverviewQuery } = adminApiSlice;
