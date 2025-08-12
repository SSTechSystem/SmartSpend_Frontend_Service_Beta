import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { API_PATH } from "../api-services/apiPath";
import { PAGE_LIMIT, SUCCESS_CODE } from "../utils/constants";
import { generateHeaders, makeApiCall } from "../api-services/makeApiCall";

// interface type of account values
interface AccountState {
  accounts: Array<Record<string, any>>;
  error: boolean;
  loading: boolean;
  limit: number;
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  account: Object | null;
  searchText: string;
}

// define state value
const initialState: AccountState = {
  accounts: [],
  error: false,
  loading: false,
  limit: PAGE_LIMIT,
  currentPage: 1,
  totalPages: 1,
  totalRecords: 0,
  account: null,
  searchText: "",
};

type QueryParams = {
  limit: number;
  page: number;
  search: string;
  status?: string;
};

export const fetchAllAccountsData = createAsyncThunk(
  "account/fetchAllAccountsData",
  async (data: any, { dispatch }) => {
    const queryParams: QueryParams = {
      limit: data.limit,
      page: data.page,
      search: data.searchText,
    };

    if (data.status !== "all") {
      queryParams.status = data.status;
    }

    const response = await dispatch(
      makeApiCall({
        method: "get",
        url: `${API_PATH.GET_ALL_ACCOUNTS}`,
        headers: {
          ...(await generateHeaders("view", "view_account")),
        },
        params: queryParams,
      })
    );
    return response.payload;
  }
);

export const fetchSingleAccount = createAsyncThunk(
  "account/fetchSingleAccount",
  async (id: number, { dispatch }) => {
    const response = await dispatch(
      makeApiCall({
        method: "get",
        url: `${API_PATH.GET_SINGLE_ACCOUNT}/${id}`,
      })
    );
    return response.payload;
  }
);

export const addAccount = createAsyncThunk(
  "account/addAccount",
  async (data: any, { dispatch }) => {
    const response = await dispatch(
      makeApiCall({
        method: "post",
        url: `${API_PATH.ADD_ACCOUNT}`,
        headers: {
          ...(await generateHeaders("add", "add_account")),
          "Content-Type": "multipart/form-data",
        },
        data,
      })
    );
    return response.payload;
  }
);

export const editAccount = createAsyncThunk(
  "account/editAccount",
  async (data: any, { dispatch }) => {
    const response = await dispatch(
      makeApiCall({
        method: "put",
        url: `${API_PATH.ADD_ACCOUNT}`,
        headers: {
          ...(await generateHeaders("edit", "edit_account")),
          "Content-Type": "multipart/form-data",
        },
        data,
      })
    );
    return response.payload;
  }
);

export const deleteAccount = createAsyncThunk(
  "account/deleteAccount",
  async (id: number, { dispatch }) => {
    const response = await dispatch(
      makeApiCall({
        method: "delete",
        url: `${API_PATH.DELETE_ACCOUNT}/${id}`,
        headers: {
          ...(await generateHeaders("delete", "delete_account")),
        },
      })
    );
    return response.payload;
  }
);

export const changeAccountStatus = createAsyncThunk(
  "account/changeAccountStatus",
  async (data: { id: number; status: number }, { dispatch }) => {
    const response = await dispatch(
      makeApiCall({
        method: "put",
        url: `${API_PATH.CHANGE_ACCOUNT_STATUS}`,
        headers: {
          ...(await generateHeaders("edit", "edit_account")),
        },
        data,
      })
    );
    return response.payload;
  }
);

// create store with auth namespace

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAllAccountsData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllAccountsData.fulfilled, (state, action) => {
        if (
          action.payload !== undefined &&
          action.payload?.status === SUCCESS_CODE
        ) {
          state.accounts = action.payload.data.data.account_details;
          state.currentPage = action.payload.data.data.current_page;
          state.limit = action.payload.data.data.limit;
          state.totalPages = action.payload.data.data.total_pages;
          state.totalRecords = action.payload.data.data.total_records;
          state.loading = false;
          state.error = false;
        }
      })
      .addCase(fetchAllAccountsData.rejected, (state) => {
        state.accounts = [];
        state.loading = false;
        state.error = true;
        state.limit = PAGE_LIMIT;
        state.currentPage = 1;
        state.totalPages = 1;
        state.totalRecords = 0;
      })
      .addCase(fetchSingleAccount.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSingleAccount.fulfilled, (state, action) => {
        if (
          action.payload !== undefined &&
          action.payload?.status === SUCCESS_CODE
        ) {
          state.account = action.payload.data.data;
          state.loading = false;
          state.error = false;
        }
      })
      .addCase(fetchSingleAccount.rejected, (state) => {
        state.account = null;
        state.loading = false;
        state.error = true;
      });
  },
});

export const getAccountsData: any = (state: RootState) => state.account;

export default accountSlice.reducer;
