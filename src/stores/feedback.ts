import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { API_PATH } from "../api-services/apiPath";
import { PAGE_LIMIT, SUCCESS_CODE } from "../utils/constants";
import { makeApiCall } from "../api-services/makeApiCall";

// interface type of user values
interface FeedbackState {
  feedbacks: Array<Record<string, any>>;
  error: boolean;
  loading: boolean;
  limit: number;
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  feedback: Object | null;
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
  feedbacks: [],
  error: false,
  loading: false,
  limit: PAGE_LIMIT,
  currentPage: 1,
  totalPages: 1,
  totalRecords: 0,
  feedback: null,
  searchText: "",
};

export const fetchAllFeedbacksData = createAsyncThunk(
  "feedback/fetchAllFeedbacksData",
  async (data: any, { dispatch }) => {
    const queryParams: QueryParams = {
      limit: data.limit,
      page: data.page,
      search: data.searchText,
    };

    const response = await dispatch(
      makeApiCall({
        method: "post",
        url: `${API_PATH.GET_ALL_FEEDBACKS}`,
        params: queryParams,
      })
    );
    return response.payload;
  }
);

export const fetchSingleFeedback = createAsyncThunk(
  "feedback/fetchSingleFeedback",
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

export const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAllFeedbacksData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllFeedbacksData.fulfilled, (state, action) => {
        if (
          action.payload !== undefined &&
          action.payload?.status === SUCCESS_CODE
        ) {
          state.feedbacks = action.payload.data.data.feedbacks_details;
          state.currentPage = action.payload.data.data.current_page;
          state.limit = action.payload.data.data.limit;
          state.totalPages = action.payload.data.data.total_pages;
          state.totalRecords = action.payload.data.data.total_records;
          state.loading = false;
          state.error = false;
        }
      })
      .addCase(fetchAllFeedbacksData.rejected, (state) => {
        state.feedbacks = [];
        state.loading = false;
        state.error = true;
        state.limit = PAGE_LIMIT;
        state.currentPage = 1;
        state.totalPages = 1;
        state.totalRecords = 0;
      })
      .addCase(fetchSingleFeedback.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSingleFeedback.fulfilled, (state, action) => {
        if (
          action.payload !== undefined &&
          action.payload?.status === SUCCESS_CODE
        ) {
          state.feedback = action.payload.data.data;
          state.loading = false;
          state.error = false;
        }
      })
      .addCase(fetchSingleFeedback.rejected, (state) => {
        state.feedback = null;
        state.loading = false;
        state.error = true;
      });
  },
});

export const getFeedbacksData: any = (state: RootState) => state.feedback;

export default feedbackSlice.reducer;
