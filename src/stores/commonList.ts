import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { API_PATH } from "../api-services/apiPath";
import { makeApiCall } from "../api-services/makeApiCall";
import { SUCCESS_CODE } from "../utils/constants";

// interface type of commonlist values
interface ListState {
  countries: Array<Record<string, any>>;
  error: boolean;
  loading: boolean;
  states: Array<Record<string, any>>;
  companiesList: Array<Record<string, any>>;
  currenciesList: Array<Record<string, any>>;
  accountsList: Array<Record<string, any>>;
  driversList: Array<Record<string, any>>;
}

// define state value
const initialState: ListState = {
  countries: [],
  states: [],
  error: false,
  loading: false,
  companiesList: [],
  currenciesList: [],
  accountsList: [],
  driversList: [],
};

export const fetchAllCountries = createAsyncThunk(
  "list/fetchAllCountries",
  async (_, { dispatch }) => {
    const response = await dispatch(
      makeApiCall({ method: "get", url: `${API_PATH.GET_ALL_COUNTRIES}` })
    );
    return response.payload;
  }
);

export const fetchAllStates = createAsyncThunk(
  "list/fetchAllStates",
  async (
    data: { country_id?: number; country_code?: string },
    { dispatch }
  ) => {
    const response = await dispatch(
      makeApiCall({ method: "post", url: `${API_PATH.GET_STATES}`, data })
    );
    return response.payload;
  }
);

export const fetchCompanyDropdown = createAsyncThunk(
  "list/fetchCompanyDropdown",
  async (_, { dispatch }) => {
    const response = await dispatch(
      makeApiCall({
        method: "get",
        url: `${API_PATH.GET_COMPANY_DROPDOWN}`,
      })
    );
    return response.payload;
  }
);

export const fetchDriverDropdown = createAsyncThunk(
  "list/fetchDriverDropdown",
  async ({ type }: { type: string }, { dispatch }) => {
    const resposne = await dispatch(
      makeApiCall({
        method: "get",
        url: `${API_PATH.GET_DRIVER_LIST_DROPDOWN}?type=${type}`,
      })
    );
    return resposne.payload;
  }
);

export const fetchAccountsDropsown = createAsyncThunk(
  "list/fetchAccountsDropsown",
  async (_, { dispatch }) => {
    const resposne = await dispatch(
      makeApiCall({
        method: "get",
        url: `${API_PATH.GET_ACCOUNT_DROPDOWN}`,
      })
    );
    return resposne.payload;
  }
);

export const fetchCurrency = createAsyncThunk(
  "list/fetchCurrency",
  async (_, { dispatch }) => {
    const resposne = await dispatch(
      makeApiCall({
        method: "get",
        url: `${API_PATH.GET_CURRENCY}`,
      })
    );
    return resposne.payload;
  }
);

// create store with auth namespace

export const listStore = createSlice({
  name: "list",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAllCountries.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllCountries.fulfilled, (state, action) => {
        if (
          action.payload !== undefined &&
          action.payload?.status === SUCCESS_CODE
        ) {
          state.countries = action.payload.data.data;
          state.loading = false;
          state.error = false;
        }
      })
      .addCase(fetchAllCountries.rejected, (state) => {
        state.countries = [];
        state.loading = false;
        state.error = true;
      })
      .addCase(fetchAllStates.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllStates.fulfilled, (state, action) => {
        if (
          action.payload !== undefined &&
          action.payload?.status === SUCCESS_CODE
        ) {
          state.states = action.payload.data.data;
          state.loading = false;
          state.error = false;
        }
      })
      .addCase(fetchAllStates.rejected, (state) => {
        state.states = [];
        state.loading = false;
        state.error = true;
      })
      .addCase(fetchCompanyDropdown.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCompanyDropdown.fulfilled, (state, action) => {
        if (
          action.payload !== undefined &&
          action.payload?.status === SUCCESS_CODE
        ) {
          state.companiesList = action.payload.data.data;
          state.loading = false;
          state.error = false;
        }
      })
      .addCase(fetchCompanyDropdown.rejected, (state) => {
        state.companiesList = [];
        state.loading = false;
        state.error = true;
      })
      .addCase(fetchAccountsDropsown.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAccountsDropsown.fulfilled, (state, action) => {
        if (
          action.payload !== undefined &&
          action.payload?.status === SUCCESS_CODE
        ) {
          state.accountsList = action.payload.data.data;
          state.loading = false;
          state.error = false;
        }
      })
      .addCase(fetchAccountsDropsown.rejected, (state) => {
        state.accountsList = [];
        state.loading = false;
        state.error = true;
      })
      .addCase(fetchCurrency.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrency.fulfilled, (state, action) => {
        if (
          action.payload !== undefined &&
          action.payload?.status === SUCCESS_CODE
        ) {
          state.currenciesList = action.payload.data.data;
          state.loading = false;
          state.error = false;
        }
      })
      .addCase(fetchCurrency.rejected, (state) => {
        state.currenciesList = [];
        state.loading = false;
        state.error = true;
      })
      .addCase(fetchDriverDropdown.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDriverDropdown.fulfilled, (state, action) => {
        if (
          action.payload !== undefined &&
          action.payload?.status === SUCCESS_CODE
        ) {
          state.driversList = action.payload.data.data;
          state.loading = false;
          state.error = false;
        }
      })
      .addCase(fetchDriverDropdown.rejected, (state) => {
        state.driversList = [];
        state.loading = false;
        state.error = true;
      });
  },
});

// getters of state with toke and user
export const getCountriesData: any = (state: RootState) => state.list.countries;
export const getStatesData: any = (state: RootState) => state.list.states;
export const getCompanyDropdownData: any = (state: RootState) =>
  state.list.companiesList;
export const getAccountDropdownData: any = (state: RootState) =>
  state.list.accountsList;
export const getCurrenciesData: any = (state: RootState) =>
  state.list.currenciesList;
export const getDriverDropdownData: any = (state: RootState) =>
  state.list.driversList;

export default listStore.reducer;
