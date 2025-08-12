import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { API_PATH } from "../api-services/apiPath";
import { generateHeaders, makeApiCall } from "../api-services/makeApiCall";
import { PAGE_LIMIT, SUCCESS_CODE } from "../utils/constants";

// interface type of company values
interface CompanyState {
  companies: Array<Record<string, any>>;
  error: boolean;
  loading: boolean;
  limit: number;
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  companyCode: string;
  company: Object | null;
  searchText: string;
}

interface SingleCompany {
  id: string;
  type: string;
}

type QueryParams = {
  limit: number;
  page: number;
  search: string;
  enable?: string;
};

// define state value
const initialState: CompanyState = {
  companies: [],
  error: false,
  loading: false,
  limit: 10,
  currentPage: 1,
  totalPages: 1,
  totalRecords: 0,
  companyCode: "",
  company: null,
  searchText: "",
};

export const fetchAllCompaniesData = createAsyncThunk(
  "company/fetchAllCompaniesData",
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
        url: `${API_PATH.GET_ALL_COMPANIES}`,
        headers: {
          ...(await generateHeaders("view", "view_company")),
        },
        params: queryParams,
      })
    );
    return response.payload;
  }
);

export const fetchSingleCompany = createAsyncThunk(
  "company/fetchSingleCompany",
  async (data: SingleCompany, { dispatch }) => {
    const response = await dispatch(
      makeApiCall({
        method: "get",
        url: `${API_PATH.GET_SINGLE_COMPANY}/${data.id}?type=${data.type}`,
        data,
      })
    );
    return response.payload;
  }
);

export const addCompany = createAsyncThunk(
  "company/addCompany",
  async (data: any, { dispatch }) => {
    const response = await dispatch(
      makeApiCall({
        method: "post",
        url: `${API_PATH.ADD_COMPANY}`,
        headers: {
          ...(await generateHeaders("add", "add_company")),
          "Content-Type": "multipart/form-data",
        },
        data,
      })
    );
    return response.payload;
  }
);

export const editCompany = createAsyncThunk(
  "company/editCompany",
  async (data: any, { dispatch }) => {
    const response = await dispatch(
      makeApiCall({
        method: "put",
        url: `${API_PATH.ADD_COMPANY}`,
        headers: {
          ...(await generateHeaders("edit", "edit_company")),
          "Content-Type": "multipart/form-data",
        },
        data,
      })
    );
    return response.payload;
  }
);

export const deleteCompany = createAsyncThunk(
  "company/deleteCompany",
  async (id: number, { dispatch }) => {
    const response = await dispatch(
      makeApiCall({
        method: "delete",
        url: `${API_PATH.DELETE_COMPANY}/${id}`,
        headers: {
          ...(await generateHeaders("delete", "delete_company")),
        },
      })
    );
    return response.payload;
  }
);

export const fetchCompanyCode = createAsyncThunk(
  "company/fetchCompanyCode",
  async (_, { dispatch }) => {
    const response = await dispatch(
      makeApiCall({
        method: "get",
        url: `${API_PATH.GET_COMPANY_CODE}`,
      })
    );
    return response.payload;
  }
);

export const editCompanyBillingInfo = createAsyncThunk(
  "company/editCompanyBillingInfo",
  async (data: any, { dispatch }) => {
    const response = await dispatch(
      makeApiCall({
        method: "post",
        url: `${API_PATH.ADD_COMPANY_BILLING}`,
        headers: {
          ...(await generateHeaders("edit", "edit_company")),
        },
        data,
      })
    );
    return response.payload;
  }
);

export const changeCompanyStatus = createAsyncThunk(
  "company/changeCompanyStatus",
  async (data: { id: number; enable: number }, { dispatch }) => {
    const response = await dispatch(
      makeApiCall({
        method: "put",
        url: `${API_PATH.CHANGE_COMPANY_STATUS}`,
        headers: {
          ...(await generateHeaders("edit", "edit_company")),
        },
        data,
      })
    );
    return response.payload;
  }
);

// create store with auth namespace

export const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAllCompaniesData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllCompaniesData.fulfilled, (state, action) => {
        if (
          action.payload !== undefined &&
          action.payload?.status === SUCCESS_CODE
        ) {
          state.companies = action.payload.data.data.company_details;
          state.currentPage = action.payload.data.data.current_page;
          state.limit = action.payload.data.data.limit;
          state.totalPages = action.payload.data.data.total_pages;
          state.totalRecords = action.payload.data.data.total_records;
          state.loading = false;
          state.error = false;
        }
      })
      .addCase(fetchAllCompaniesData.rejected, (state) => {
        state.companies = [];
        state.loading = false;
        state.error = true;
        state.limit = PAGE_LIMIT;
        state.currentPage = 1;
        state.totalPages = 1;
        state.totalRecords = 0;
      })
      .addCase(fetchSingleCompany.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSingleCompany.fulfilled, (state, action) => {
        if (
          action.payload !== undefined &&
          action.payload?.status === SUCCESS_CODE
        ) {
          state.company = action.payload.data.data;
          state.loading = false;
          state.error = false;
        }
      })
      .addCase(fetchSingleCompany.rejected, (state) => {
        state.company = null;
        state.loading = false;
        state.error = true;
      })
      .addCase(fetchCompanyCode.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCompanyCode.fulfilled, (state, action) => {
        if (
          action.payload !== undefined &&
          action.payload?.status === SUCCESS_CODE
        ) {
          state.companyCode = action.payload.data.data.next_company_code;
          state.loading = false;
          state.error = false;
        }
      })
      .addCase(fetchCompanyCode.rejected, (state) => {
        state.companyCode = "";
        state.loading = false;
        state.error = true;
      });
  },
});

// getters of state with toke and user
export const getCompaniesData: any = (state: RootState) => state.company;

export default companySlice.reducer;
