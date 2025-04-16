import { createSlice } from "@reduxjs/toolkit";
import { userApi } from "../apis/UserApi";
import { authApi } from "../apis/AuthApi";

interface AuthState {
  user: {
    id: number;
    emailVerified: boolean;
    role: string;
    avatar?: string;
  } | null;
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      console.log("action.payload: ", action.payload);
      state.user = action.payload;
      state.isLoggedIn = !!action.payload;
    },
    clearUser: (state) => {
      state.user = null;
      state.isLoggedIn = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(userApi.endpoints.getMe.matchFulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isLoggedIn = true;
      })
      .addMatcher(userApi.endpoints.getMe.matchRejected, (state) => {
        state.user = null;
        state.isLoggedIn = false;
      })
      .addMatcher(authApi.endpoints.signOut.matchFulfilled, (state) => {
        state.user = null;
        state.isLoggedIn = false;
      });
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
