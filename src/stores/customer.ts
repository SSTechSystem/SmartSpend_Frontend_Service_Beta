import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { API_PATH } from "../api-services/apiPath";
import { PAGE_LIMIT, SUCCESS_CODE } from "../utils/constants";
import { generateHeaders, makeApiCall } from "../api-services/makeApiCall";

// interface type of user values
interface UserState {
  users: Array<Record<string, any>>;
  error: boolean;
  loading: boolean;
  limit: number;
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  user: Object | null;
  searchText: string;
  userProfile: Object | null;
};

type QueryParams = {
  limit: number;
  page: number;
  search: string;
  enable?: string;
  user_role?: number;
  device_type?: number;
};

// define state value
const initialState: UserState = {
  users: [],
  error: false,
  loading: false,
  limit: PAGE_LIMIT,
  currentPage: 1,
  totalPages: 1,
  totalRecords: 0,
  user: null,
  searchText: "",
  userProfile: null,
};

export const fetchAllCustomersData = createAsyncThunk(
  "user/fetchAllCustomersData",
  async (data: any, { dispatch }) => {
    const queryParams: QueryParams = {
      limit: data.limit,
      page: data.page,
      search: data.searchText,
      user_role: data.user_role,
      device_type: data.device_type,
    };

    if (data.enable !== "all") {
      queryParams.enable = data.enable;
    }

    const response = await dispatch(
      makeApiCall({
        method: "post",
        url: `${API_PATH.GET_ALL_CUSTOMERS}`,
        headers: {
          ...(await generateHeaders("view", "view_user")),
        },
        params: queryParams,
      })
    );
    return response.payload;
  }
);

export const fetchSingleCustomer = createAsyncThunk(
  "user/fetchSingleCustomer",
  async (id: number, { dispatch }) => {
    const response = await dispatch(
      makeApiCall({
        method: "get",
        url: `${API_PATH.GET_SINGLE_USER}/${id}`,
      })
    );
    return response.payload;
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAllCustomersData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllCustomersData.fulfilled, (state, action) => {
        if (
          action.payload !== undefined &&
          action.payload?.status === SUCCESS_CODE
        ) {
          state.users = action.payload.data.data.customer_details;
          state.currentPage = action.payload.data.data.current_page;
          state.limit = action.payload.data.data.limit;
          state.totalPages = action.payload.data.data.total_pages;
          state.totalRecords = action.payload.data.data.total_records;
          state.loading = false;
          state.error = false;
        }
      })
      .addCase(fetchAllCustomersData.rejected, (state) => {
        state.users = [];
        state.loading = false;
        state.error = true;
        state.limit = PAGE_LIMIT;
        state.currentPage = 1;
        state.totalPages = 1;
        state.totalRecords = 0;
      })
      .addCase(fetchSingleCustomer.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSingleCustomer.fulfilled, (state, action) => {
        if (
          action.payload !== undefined &&
          action.payload?.status === SUCCESS_CODE
        ) {
          state.user = action.payload.data.data;
          state.loading = false;
          state.error = false;
        }
      })
      .addCase(fetchSingleCustomer.rejected, (state) => {
        state.user = null;
        state.loading = false;
        state.error = true;
      });
  },
});

export const getCustomersData: any = (state: RootState) => state.user;

export default userSlice.reducer;
