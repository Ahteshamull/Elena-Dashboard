import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Create the base API slice
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL || "https://api.tableli.com/api/v1",
    prepareHeaders: (headers) => {
      const token =
        localStorage.getItem("accessToken") ||
        localStorage.getItem("resettoken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["User", "Profile"],
  endpoints: (builder) => ({}),
});
