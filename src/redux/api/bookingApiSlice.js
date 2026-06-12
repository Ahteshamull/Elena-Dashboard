import { apiSlice } from "./apiSlice";

export const bookingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllBookings: builder.query({
      query: () => "/booking/all",
      providesTags: ["Booking"],
    }),
    getBookingById: builder.query({
      query: (id) => `/booking/${id}`,
      providesTags: ["Booking"],
    }),
    updateBookingStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/booking/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Booking"],
    }),
    capturePayment: builder.mutation({
      query: (paymentId) => ({
        url: `/payment/capture/${paymentId}`,
        method: "POST",
      }),
      invalidatesTags: ["Booking", "Payment"],
    }),
    getAllPayments: builder.query({
      query: () => "/payment/manager",
      providesTags: ["Payment"],
    }),
  }),
});

export const {
  useGetAllBookingsQuery,
  useGetBookingByIdQuery,
  useUpdateBookingStatusMutation,
  useCapturePaymentMutation,
  useGetAllPaymentsQuery,
} = bookingApiSlice;
