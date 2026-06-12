import { apiSlice } from './apiSlice';

export const faqApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createFaq: builder.mutation({
      query: (data) => ({
        url: '/faq/create-faq',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Faq'],
    }),
    getFaqs: builder.query({
      query: () => '/faq/get-all-faqs',
      providesTags: ['Faq'],
    }),
    updateFaq: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/faq/update-faq/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Faq'],
    }),
    deleteFaq: builder.mutation({
      query: (id) => ({
        url: `/faq/delete-faq/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Faq'],
    }),
  }),
});

export const { 
  useCreateFaqMutation, 
  useGetFaqsQuery,
  useUpdateFaqMutation,
  useDeleteFaqMutation
} = faqApiSlice;
