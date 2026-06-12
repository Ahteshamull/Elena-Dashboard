import { apiSlice } from "./apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: "/admin/forgot-password",
        method: "POST",
        body: data,
      }),
    }),
    verifyOtp: builder.mutation({
      query: (data) => ({
        url: "/admin/otp-verify",
        method: "POST",
        body: data,
      }),
    }),
    resendOtp: builder.mutation({
      query: (data) => ({
        url: "/admin/resend-otp",
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/admin/reset-password",
        method: "POST",
        body: data,
      }),
    }),
    login: builder.mutation({
      query: (data) => ({
        url: "/admin/admin-login",
        method: "POST",
        body: data,
      }),
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: "/admin/change-password",
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const { useForgotPasswordMutation, useVerifyOtpMutation, useResendOtpMutation, useResetPasswordMutation, useLoginMutation, useChangePasswordMutation } = authApiSlice;
