import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
    currentUser: null,
    token: null,
    refreshToken: null,
    loading: false,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.users = action.payload;
    },
    setCredentials: (state, action) => {
      state.currentUser = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
    },
    logout: (state) => {
      state.currentUser = null;
      state.token = null;
      state.refreshToken = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setUser, setCredentials, logout, setLoading, setError } = userSlice.actions;
export default userSlice.reducer;

