import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { API_PATH } from "../api-services/apiPath";
import { resetUserData } from "./dashboard";
import secureLocalStorage from "react-secure-storage";
import { makeApiCall } from "../api-services/makeApiCall";
import { SUCCESS_CODE, UNAUTH_CODE } from "../utils/constants";

// interface type of auth values
interface AuthState {
  token: any;
  username: any;
  error: any;
}

// define state value
const initialState: AuthState = {
  token: localStorage.getItem("token") ? localStorage.getItem("token") : null,
  username: secureLocalStorage.getItem("user")
    ? secureLocalStorage.getItem("user")
    : null,
  error: null,
};

export const setAuthentication = createAsyncThunk(
  "auth/setAuthentication",
  async (data: any, { dispatch }) => {
    const response = await dispatch(
      makeApiCall({
        method: "post",
        url: `${API_PATH.SIGN_IN}`,
        data,
      })
    );
    return response.payload;
  }
);

export const setLogout = createAsyncThunk(
  "auth/setLogout",
  async (_, { dispatch }) => {
    const response = await dispatch(
      makeApiCall({
        method: "post",
        url: `${API_PATH.SIGN_OUT}`,
        data: {},
      })
    );
    if (
      response.payload?.status === SUCCESS_CODE ||
      response.payload?.status === UNAUTH_CODE
    ) {
      dispatch(resetUserData());
    }
    return response.payload;
  }
);

export const forgetPassword = createAsyncThunk(
  "auth/forgetPassword",
  async (data: any, { dispatch }) => {
    const response = await dispatch(
      makeApiCall({
        method: "post",
        url: `${API_PATH.FORGET_PASSWORD}`,
        data,
      })
    );
    return response.payload;
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (data: any, { dispatch }) => {
    const response = await dispatch(
      makeApiCall({
        method: "post",
        url: `${API_PATH.RESET_PASSWORD}`,
        data,
      })
    );
    return response.payload;
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (data: any, { dispatch }) => {
    const response = await dispatch(
      makeApiCall({
        method: "patch",
        url: `${API_PATH.CHANGE_PASSWORD}`,
        data,
      })
    );
    return response.payload;
  }
);

// create store with auth namespace
export const authStore = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(setAuthentication.fulfilled, (state, action) => {
        if (action.payload?.status === SUCCESS_CODE) {
          state.token = action.payload.data.data.token;
          state.username = action.payload.data.data.username;
          localStorage.setItem("token", state.token);
          secureLocalStorage.setItem("username",state.username);
        }
      })
      .addCase(setAuthentication.rejected, (state, action) => {
        state.error = action.error.message;
      })
      .addCase(setLogout.fulfilled, (state, action) => {
        if (
          action.payload?.status === SUCCESS_CODE ||
          action.payload?.status === UNAUTH_CODE
        ) {
          state.token = null;
          state.username = null;
          localStorage.removeItem("token");
          secureLocalStorage.removeItem("username");
        }
      })
      .addCase(setLogout.rejected, (state) => {
        state.error = "Error";
      });
  },
});

// getters of state with toke and user
export const selectAuth: any = (state: RootState) => {
  if (!localStorage.getItem("token")) {
    localStorage.setItem("token", "");
  }

  return state.auth;
};

export default authStore.reducer;
