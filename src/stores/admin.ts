import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { API_PATH } from "../api-services/apiPath";
import { PAGE_LIMIT, SUCCESS_CODE } from "../utils/constants";
import { generateHeaders, makeApiCall } from "../api-services/makeApiCall";

// interface type of admin values
interface AdminState {
  admins: Array<Record<string, any>>;
  error: boolean;
  loading: boolean;
  limit: number;
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  admin: Object | null;
  searchText: string;
  userProfile: Object | null;
};

type QueryParams = {
  limit: number;
  page: number;
  search: string;
};

// define state value
const initialState: AdminState = {
  admins: [],
  error: false,
  loading: false,
  limit: PAGE_LIMIT,
  currentPage: 1,
  totalPages: 1,
  totalRecords: 0,
  admin: null,
  searchText: "",
  userProfile: null,
};

export const fetchAllAdminData = createAsyncThunk(
  "admin/fetchAllAdminData",
  async (data: any, { dispatch }) => {
    const queryParams: QueryParams = {
      limit: data.limit,
      page: data.page,
      search: data.searchText,
    };

    const response = await dispatch(
      makeApiCall({
        method: "get",
        url: `${API_PATH.GET_ALL_ADMIN}`,
        headers: {
          ...(await generateHeaders("view", "view_user")),
        },
        params: queryParams,
      })
    );
    return response.payload;
  }
);

export const fetchSingleAdmin = createAsyncThunk(
  "admin/fetchSingleAdmin",
  async (id: number, { dispatch }) => {
    const response = await dispatch(
      makeApiCall({
        method: "get",
        url: `${API_PATH.GET_SINGLE_ADMIN}/${id}`,
      })
    );
    return response.payload;
  }
);

export const deleteAdmin = createAsyncThunk(
  "admin/deleteAdmin",
  async (id: number, { dispatch }) => {
    const response = await dispatch(
      makeApiCall({
        method: "delete",
        url: `${API_PATH.DELETE_ADMIN}/${id}`,
      })
    );
    return response.payload;
  }
);

export const updateAdmin = createAsyncThunk(
  "admin/updateAdmin",
  async (data: any, { dispatch }) => {
    console.log('data: ', data);
    const response = await dispatch(
      makeApiCall({
        method: "patch",
        url: `${API_PATH.UPDATE_ADMIN}`,
        data,
      })
    );
    return response.payload;
  }
);

export const addAdmin = createAsyncThunk(
  "admin/addAdmin",
  async (data: any, { dispatch }) => {
    const response = await dispatch(
      makeApiCall({
        method: "post",
        url: `${API_PATH.UPDATE_ADMIN}`,
        data,
      })
    );
    return response.payload;
  }
);

export const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAllAdminData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllAdminData.fulfilled, (state, action) => {
        if (
          action.payload !== undefined &&
          action.payload?.status === SUCCESS_CODE
        ) {
          state.admins = action.payload.data.data.admins_details;
          state.currentPage = action.payload.data.data.current_page;
          state.limit = action.payload.data.data.limit;
          state.totalPages = action.payload.data.data.total_pages;
          state.totalRecords = action.payload.data.data.total_records;
          state.loading = false;
          state.error = false;
        }
      })
      .addCase(fetchAllAdminData.rejected, (state) => {
        state.admins = [];
        state.loading = false;
        state.error = true;
        state.limit = PAGE_LIMIT;
        state.currentPage = 1;
        state.totalPages = 1;
        state.totalRecords = 0;
      })
      .addCase(fetchSingleAdmin.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSingleAdmin.fulfilled, (state, action) => {
        if (
          action.payload !== undefined &&
          action.payload?.status === SUCCESS_CODE
        ) {
          state.admin = action.payload.data.data;
          state.loading = false;
          state.error = false;
        }
      })
      .addCase(fetchSingleAdmin.rejected, (state) => {
        state.admin = null;
        state.loading = false;
        state.error = true;
      });
  },
});

export const getAdminData: any = (state: RootState) => state.admin;

export default adminSlice.reducer;
