import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { API_PATH } from "../api-services/apiPath";
import { PAGE_LIMIT, SUCCESS_CODE } from "../utils/constants";
import { makeApiCall } from "../api-services/makeApiCall";

// interface type of user values
interface FeedbackState {
  backups: Array<Record<string, any>>;
  error: boolean;
  loading: boolean;
  limit: number;
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  backup: Object | null;
  searchText: string;
};

type QueryParams = {
  limit: number;
  page: number;
  search: string;
  enable?: string;
};

// define state value
const initialState: FeedbackState = {
  backups: [],
  error: false,
  loading: false,
  limit: PAGE_LIMIT,
  currentPage: 1,
  totalPages: 1,
  totalRecords: 0,
  backup: null,
  searchText: "",
};

export const fetchAllBackupData = createAsyncThunk(
  "backup/fetchAllBackupData",
  async (data: any, { dispatch }) => {
    const queryParams: QueryParams = {
      limit: data.limit,
      page: data.page,
      search: data.searchText,
    };

    const response = await dispatch(
      makeApiCall({
        method: "get",
        url: `${API_PATH.GET_ALL_BACKUPS}`,
        params: queryParams,
      })
    );
    return response.payload;
  }
);

export const fetchSingleBackup = createAsyncThunk(
  "backup/fetchSingleBackup",
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

export const backupSlice = createSlice({
  name: "backup",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAllBackupData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllBackupData.fulfilled, (state, action) => {
        if (
          action.payload !== undefined &&
          action.payload?.status === SUCCESS_CODE
        ) {
          state.backups = action.payload.data.data.backups_details;
          state.currentPage = action.payload.data.data.current_page;
          state.limit = action.payload.data.data.limit;
          state.totalPages = action.payload.data.data.total_pages;
          state.totalRecords = action.payload.data.data.total_records;
          state.loading = false;
          state.error = false;
        }
      })
      .addCase(fetchAllBackupData.rejected, (state) => {
        state.backups = [];
        state.loading = false;
        state.error = true;
        state.limit = PAGE_LIMIT;
        state.currentPage = 1;
        state.totalPages = 1;
        state.totalRecords = 0;
      })
      .addCase(fetchSingleBackup.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSingleBackup.fulfilled, (state, action) => {
        if (
          action.payload !== undefined &&
          action.payload?.status === SUCCESS_CODE
        ) {
          state.backup = action.payload.data.data;
          state.loading = false;
          state.error = false;
        }
      })
      .addCase(fetchSingleBackup.rejected, (state) => {
        state.backup = null;
        state.loading = false;
        state.error = true;
      });
  },
});

export const getBackupData: any = (state: RootState) => state.backup;

export default backupSlice.reducer;
