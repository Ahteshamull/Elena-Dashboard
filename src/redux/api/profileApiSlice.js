import { apiSlice } from './apiSlice';

export const profileApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPendingProfiles: builder.query({
      query: () => `/profile/admin/pending-profiles`,
      providesTags: ['Profile'],
    }),
    getProfileByUserId: builder.query({
      query: (id) => `/profile/user/${id}`,
      providesTags: ['Profile'],
    }),
    updateProfileStatus: builder.mutation({
      query: ({ id, status, rejectionReason }) => ({
        url: `/profile/admin/status/${id}`,
        method: 'PATCH',
        body: { status, rejectionReason },
      }),
      invalidatesTags: ['Profile', 'User'],
    }),
  }),
});

export const { 
  useGetPendingProfilesQuery, 
  useGetProfileByUserIdQuery,
  useUpdateProfileStatusMutation 
} = profileApiSlice;
