import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { API_PATH } from "../api-services/apiPath";
import { makeApiCall } from "../api-services/makeApiCall";
import { SUCCESS_CODE } from "../utils/constants";
import secureLocalStorage from "react-secure-storage";

// interface type of dashboard values
interface DashboardState {
  user: Object | any;
  error: boolean;
  loading: boolean;
}

// define state value
const initialState: DashboardState = {
  user: null,
  error: false,
  loading: false,
};

export const setLoginUserData = createAsyncThunk(
  "auth/setLoginUserData",
  async (_, { dispatch }) => {
    const resposne = await dispatch(
      makeApiCall({
        method: "get",
        url: `${API_PATH.GET_DASHBOARD_DATA}`,
      })
    );
    return resposne.payload;
  }
);

// create store with auth namespace

export const dashboardStore = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    resetUserData: (state) => {
      state.user = null;
      state.error = false;
      state.loading = false;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(setLoginUserData.pending, (state) => {
        state.loading = true;
      })
      .addCase(setLoginUserData.fulfilled, (state, action) => {
        if (action.payload?.status === SUCCESS_CODE) {
          state.user = action.payload.data.data;
          secureLocalStorage.setItem("user", JSON.stringify(state.user));
          secureLocalStorage.setItem(
            "role",
            action.payload.data.data.role.role_name
          );
          // secureLocalStorage.setItem(
          //   "permissions",
          //   JSON.stringify(action.payload.data.data.permissions)
          // );
          secureLocalStorage.setItem(
            "username",
            JSON.stringify(action.payload.data.data.name)
          );
          state.loading = false;
          state.error = false;
        }
      })
      .addCase(setLoginUserData.rejected, (state) => {
        state.user = null;
        state.loading = false;
        state.error = true;
      });
  },
});

// getters of state with toke and user
export const getUserData = (state: RootState) => state.dashboard;
export const { resetUserData } = dashboardStore.actions;

export default dashboardStore.reducer;
