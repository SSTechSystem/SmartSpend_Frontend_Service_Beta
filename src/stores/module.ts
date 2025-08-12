import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { API_PATH } from "../api-services/apiPath";
import { PAGE_LIMIT, SUCCESS_CODE } from "../utils/constants";
import { makeApiCall } from "../api-services/makeApiCall";

type SingleModuleData = {
  name: string;
  enable: number;
  id?: number;
  superadmin_access: number;
};

// interface type of module values
interface ModuleState {
  error: boolean;
  loading: boolean;
  singleModuleLoading: boolean;
  modules: Array<Record<string, any>>;
  module: SingleModuleData | null;
  limit: number;
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  searchText: string;
}

type QueryParams = {
  limit: number;
  page: number;
  search: string;
  enable?: string;
};

// define state value
const initialState: ModuleState = {
  error: false,
  loading: false,
  singleModuleLoading: false,
  module: null,
  modules: [],
  limit: PAGE_LIMIT,
  currentPage: 1,
  totalPages: 1,
  totalRecords: 0,
  searchText: "",
};

export const fetchAllModules = createAsyncThunk(
  "module/fetchAllModules",
  async (data: any, { dispatch }) => {
    const queryParams: QueryParams = {
      limit: data.limit,
      page: data.page,
      search: data.searchText,
    };

    if (data.enable !== "all") {
      queryParams.enable = data.enable;
    }

    const response = await dispatch(
      makeApiCall({
        method: "get",
        url: `${API_PATH.GET_MODULES_LIST}`,
        params: queryParams,
      })
    );
    return response.payload;
  }
);

export const addModule = createAsyncThunk(
  "module/addModule",
  async (data: any, { dispatch }) => {
    const response = await dispatch(
      makeApiCall({
        method: "post",
        url: `${API_PATH.ADD_MODULE}`,
        data,
      })
    );
    return response.payload;
  }
);

export const editModule = createAsyncThunk(
  "module/editModule",
  async (data: any, { dispatch }) => {
    const response = await dispatch(
      makeApiCall({
        method: "put",
        url: `${API_PATH.EDIT_MODULE}`,
        data,
      })
    );
    return response.payload;
  }
);

export const fetchSingleModule = createAsyncThunk(
  "module/fetchSingleModule",
  async (id: number, { dispatch }) => {
    const response = await dispatch(
      makeApiCall({
        method: "get",
        url: `${API_PATH.GET_SINGLE_MODULE}/${id}`,
      })
    );
    return response.payload;
  }
);

export const deleteModule = createAsyncThunk(
  "brand/deleteModule",
  async (id: number, { dispatch }) => {
    const response = await dispatch(
      makeApiCall({
        method: "delete",
        url: `${API_PATH.DELETE_MODULE}/${id}`,
      })
    );
    return response.payload;
  }
);

// create store with auth namespace

export const moduleSlice = createSlice({
  name: "module",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAllModules.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllModules.fulfilled, (state, action) => {
        if (
          action.payload !== undefined &&
          action.payload?.status === SUCCESS_CODE
        ) {
          state.modules = action.payload.data.data.module_details;
          state.currentPage = action.payload.data.data.current_page;
          state.limit = action.payload.data.data.limit;
          state.totalPages = action.payload.data.data.total_pages;
          state.totalRecords = action.payload.data.data.total_records;
          state.loading = false;
          state.error = false;
        }
      })
      .addCase(fetchAllModules.rejected, (state) => {
        state.modules = [];
        state.loading = false;
        state.error = true;
        state.limit = PAGE_LIMIT;
        state.currentPage = 1;
        state.totalPages = 1;
        state.totalRecords = 0;
      })
      .addCase(fetchSingleModule.pending, (state) => {
        state.singleModuleLoading = true;
      })
      .addCase(fetchSingleModule.fulfilled, (state, action) => {
        if (action.payload?.status === SUCCESS_CODE) {
          state.module = action.payload.data.data;
          state.singleModuleLoading = false;
          state.error = false;
        }
      })
      .addCase(fetchSingleModule.rejected, (state) => {
        state.error = true;
        state.module = null;
        state.singleModuleLoading = false;
      });
  },
});

export const getModulesData = (state: RootState) => state.module;
export const getSingleModuleData = (state: RootState) => state.module.module;

export default moduleSlice.reducer;
