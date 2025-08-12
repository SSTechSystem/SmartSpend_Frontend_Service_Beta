import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { API_PATH } from "../api-services/apiPath";
import { ListOptions, PAGE_LIMIT, SUCCESS_CODE } from "../utils/constants";
import { generateHeaders, makeApiCall } from "../api-services/makeApiCall";

type QueryParams = {
  limit: number;
  page: number;
  status?: string;
  res_type?: string;
  start_date: string;
  end_date: string;
  module?: string;
};

// interface type of log values
interface LogsState {
  apiLogs: Array<Record<string, any>>;
  systemLogs: Array<Record<string, any>>;
  error: boolean;
  loading: boolean;
  limit: number;
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  apiLog: Object | null;
  systemLog: Object | null;
  moduleDropdown: ListOptions[];
}

// define state value
const initialState: LogsState = {
  apiLogs: [],
  systemLogs: [],
  error: false,
  loading: false,
  limit: 10,
  currentPage: 1,
  totalPages: 1,
  totalRecords: 0,
  apiLog: null,
  systemLog: null,
  moduleDropdown: [],
};

export const fetchAllApiLogs = createAsyncThunk(
  "log/fetchAllApiLogs",
  async (data: any, { dispatch }) => {
    const queryParams: QueryParams = {
      limit: data.limit,
      page: data.page,
      end_date: data.end_date,
      start_date: data.start_date,
    };

    if (data.status !== "all") {
      queryParams.status = data.status;
    }
    const response = await dispatch(
      makeApiCall({
        method: "get",
        url: `${API_PATH.GET_ALL_API_LOGS}`,
        headers: {
          ...(await generateHeaders("view", "view_logs")),
        },
        params: queryParams,
      })
    );
    return response.payload;
  }
);

export const fetchSingleApiLog = createAsyncThunk(
  "log/fetchSingleApiLog",
  async (id: number, { dispatch }) => {
    const response = await dispatch(
      makeApiCall({
        method: "get",
        url: `${API_PATH.GET_SINGLE_API_LOG}/${id}`,
        headers: {
          ...(await generateHeaders("view", "view_logs")),
        },
      })
    );
    return response.payload;
  }
);

export const fetchAllSystemLogs = createAsyncThunk(
  "log/fetchAllSystemLogs",
  async (data: any, { dispatch }) => {
    const queryParams: QueryParams = {
      limit: data.limit,
      page: data.page,
      end_date: data.end_date,
      start_date: data.start_date,
      module: data.module,
    };

    if (data.res_type !== "all") {
      queryParams.res_type = data.res_type;
    }
    const response = await dispatch(
      makeApiCall({
        method: "get",
        url: `${API_PATH.GET_ALL_SYSTEM_LOGS}`,
        headers: {
          ...(await generateHeaders("view", "view_logs")),
        },
        params: queryParams,
      })
    );
    return response.payload;
  }
);

export const fetchSingleSystemLog = createAsyncThunk(
  "log/fetchSingleSystemLog",
  async (id: number, { dispatch }) => {
    const response = await dispatch(
      makeApiCall({
        method: "get",
        url: `${API_PATH.GET_SINGLE_SYSTEM_LOG}/${id}`,
        headers: {
          ...(await generateHeaders("view", "view_logs")),
        },
      })
    );
    return response.payload;
  }
);

export const fetchModuleNamesDropdown = createAsyncThunk(
  "log/fetchModuleNamesDropdown",
  async (_, { dispatch }) => {
    const response = await dispatch(
      makeApiCall({
        method: "get",
        url: `${API_PATH.GET_MODULE_DROPDOWN}`,
        headers: {
          ...(await generateHeaders("view", "view_logs")),
        },
      })
    );
    return response.payload;
  }
);

// create store with auth namespace

export const logSlice = createSlice({
  name: "log",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAllApiLogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllApiLogs.fulfilled, (state, action) => {
        if (
          action.payload !== undefined &&
          action.payload?.status === SUCCESS_CODE
        ) {
          state.apiLogs = action.payload.data.data.log_details;
          state.currentPage = action.payload.data.data.current_page;
          state.limit = action.payload.data.data.limit;
          state.totalPages = action.payload.data.data.total_pages;
          state.totalRecords = action.payload.data.data.total_records;
          state.loading = false;
          state.error = false;
        }
      })
      .addCase(fetchAllApiLogs.rejected, (state) => {
        state.apiLogs = [];
        state.loading = false;
        state.error = true;
        state.limit = PAGE_LIMIT;
        state.currentPage = 1;
        state.totalPages = 1;
        state.totalRecords = 0;
      })
      .addCase(fetchAllSystemLogs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllSystemLogs.fulfilled, (state, action) => {
        if (
          action.payload !== undefined &&
          action.payload?.status === SUCCESS_CODE
        ) {
          state.systemLogs = action.payload.data.data.log_details;
          state.currentPage = action.payload.data.data.current_page;
          state.limit = action.payload.data.data.limit;
          state.totalPages = action.payload.data.data.total_pages;
          state.totalRecords = action.payload.data.data.total_records;
          state.loading = false;
          state.error = false;
        }
      })
      .addCase(fetchAllSystemLogs.rejected, (state) => {
        state.systemLogs = [];
        state.loading = false;
        state.error = true;
        state.limit = PAGE_LIMIT;
        state.currentPage = 1;
        state.totalPages = 1;
        state.totalRecords = 0;
      })
      .addCase(fetchSingleApiLog.fulfilled, (state, action) => {
        if (
          action.payload !== undefined &&
          action.payload?.status === SUCCESS_CODE
        ) {
          state.apiLog = action.payload.data.data;
          state.error = false;
        }
      })
      .addCase(fetchSingleApiLog.rejected, (state) => {
        state.apiLog = null;
        state.error = true;
      })
      .addCase(fetchSingleSystemLog.fulfilled, (state, action) => {
        if (
          action.payload !== undefined &&
          action.payload?.status === SUCCESS_CODE
        ) {
          state.systemLog = action.payload.data.data;
          state.error = false;
        }
      })
      .addCase(fetchSingleSystemLog.rejected, (state) => {
        state.systemLog = null;
        state.error = true;
      })
      .addCase(fetchModuleNamesDropdown.fulfilled, (state, action) => {
        if (
          action.payload !== undefined &&
          action.payload?.status === SUCCESS_CODE
        ) {
          state.moduleDropdown = action.payload.data.data;
          state.error = false;
        }
      })
      .addCase(fetchModuleNamesDropdown.rejected, (state) => {
        state.moduleDropdown = [];
        state.error = true;
      });
  },
});

// getters of state with toke and user
export const getLogsData = (state: RootState) => state.logs;

export default logSlice.reducer;
