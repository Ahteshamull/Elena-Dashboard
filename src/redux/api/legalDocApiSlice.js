import { apiSlice } from './apiSlice';

export const legalDocApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createLegalDoc: builder.mutation({
      query: ({ content, data }) => ({
        url: `/legalDoc/create-doc/${content}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { content }) => [{ type: 'LegalDoc', id: content }],
    }),
    getLegalDoc: builder.query({
      query: (content) => `/legalDoc/get-doc/${content}`,
      providesTags: (result, error, content) => [{ type: 'LegalDoc', id: content }],
    }),
  }),
});

export const { useCreateLegalDocMutation, useGetLegalDocQuery } = legalDocApiSlice;
