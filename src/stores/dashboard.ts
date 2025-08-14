import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { API_PATH } from "../api-services/apiPath";
import { makeApiCall } from "../api-services/makeApiCall";
import { SUCCESS_CODE } from "../utils/constants";

// interface type of dashboard values
interface DashboardState {
  dashboard: Object | any;
  error: boolean;
  loading: boolean;
}

// define state value
const initialState: DashboardState = {
  dashboard: null,
  error: false,
  loading: false,
};

export const setDashboardData = createAsyncThunk(
  "auth/setDashboardData",
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
      state.dashboard = null;
      state.error = false;
      state.loading = false;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(setDashboardData.pending, (state) => {
        state.loading = true;
      })
      .addCase(setDashboardData.fulfilled, (state, action) => {
        if (action.payload?.status === SUCCESS_CODE) {
          state.dashboard = action.payload.data.data;
          state.loading = false;
          state.error = false;
        }
      })
      .addCase(setDashboardData.rejected, (state) => {
        state.dashboard = null;
        state.loading = false;
        state.error = true;
      });
  },
});

// getters of state with toke and user
export const getDashboardData = (state: RootState) => state.dashboard;
export const { resetUserData } = dashboardStore.actions;

export default dashboardStore.reducer;
