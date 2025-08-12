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
}

type QueryParams = {
  limit: number;
  page: number;
  search: string;
  enable?: string;
  role_id?: number;
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

export const fetchAllUsersData = createAsyncThunk(
  "user/fetchAllUsersData",
  async (data: any, { dispatch }) => {
    const queryParams: QueryParams = {
      limit: data.limit,
      page: data.page,
      search: data.searchText,
      role_id: data.role_id,
    };

    if (data.enable !== "all") {
      queryParams.enable = data.enable;
    }

    const response = await dispatch(
      makeApiCall({
        method: "get",
        url: `${API_PATH.GET_ALL_USERS}`,
        headers: {
          ...(await generateHeaders("view", "view_user")),
        },
        params: queryParams,
      })
    );
    return response.payload;
  }
);

export const fetchSingleUser = createAsyncThunk(
  "user/fetchSingleUser",
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

export const addUser = createAsyncThunk(
  "user/addUser",
  async (data: any, { dispatch }) => {
    const response = await dispatch(
      makeApiCall({
        method: "post",
        url: `${API_PATH.ADD_USER}`,
        headers: {
          ...(await generateHeaders("add", "add_user")),
          "Content-Type": "multipart/form-data",
        },
        data,
      })
    );
    return response.payload;
  }
);

export const editUser = createAsyncThunk(
  "user/editUser",
  async (data: any, { dispatch }) => {
    const response = await dispatch(
      makeApiCall({
        method: "put",
        url: `${API_PATH.ADD_USER}`,
        headers: {
          ...(await generateHeaders("edit", "edit_user")),
          "Content-Type": "multipart/form-data",
        },
        data,
      })
    );
    return response.payload;
  }
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (id: number, { dispatch }) => {
    const response = await dispatch(
      makeApiCall({
        method: "delete",
        url: `${API_PATH.DELETE_USER}/${id}`,
        headers: {
          ...(await generateHeaders("delete", "delete_user")),
        },
      })
    );
    return response.payload;
  }
);

export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async (data: any, { dispatch }) => {
    const response = await dispatch(
      makeApiCall({
        method: "put",
        url: `${API_PATH.UPDATE_USER_PROFILE}`,
        data,
      })
    );
    return response.payload;
  }
);

export const verifyUser = createAsyncThunk(
  "user/verifyUser",
  async (data: any, { dispatch }) => {
    const response = await dispatch(
      makeApiCall({
        method: "post",
        url: `${API_PATH.VERIFY_USER}`,
        data,
      })
    );
    return response.payload;
  }
);

export const changeUserStatus = createAsyncThunk(
  "user/changeUserStatus",
  async (data: { id: number; enable: number }, { dispatch }) => {
    const response = await dispatch(
      makeApiCall({
        method: "put",
        url: `${API_PATH.CHANGE_USER_STATUS}`,
        headers: {
          ...(await generateHeaders("edit", "edit_user")),
        },
        data,
      })
    );
    return response.payload;
  }
);

export const sendVerificationEmail = createAsyncThunk(
  "user/sendVerificationEmail",
  async (data: { id: number }, { dispatch }) => {
    const response = await dispatch(
      makeApiCall({
        method: "post",
        url: `${API_PATH.RESEND_VERIFICATION_EMAIL}`,
        data,
        headers: {
          ...(await generateHeaders("view", "view_user")),
        },
      })
    );
    return response.payload;
  }
);

// create store with auth namespace

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAllUsersData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllUsersData.fulfilled, (state, action) => {
        if (
          action.payload !== undefined &&
          action.payload?.status === SUCCESS_CODE
        ) {
          state.users = action.payload.data.data.user_details;
          state.currentPage = action.payload.data.data.current_page;
          state.limit = action.payload.data.data.limit;
          state.totalPages = action.payload.data.data.total_pages;
          state.totalRecords = action.payload.data.data.total_records;
          state.loading = false;
          state.error = false;
        }
      })
      .addCase(fetchAllUsersData.rejected, (state) => {
        state.users = [];
        state.loading = false;
        state.error = true;
        state.limit = PAGE_LIMIT;
        state.currentPage = 1;
        state.totalPages = 1;
        state.totalRecords = 0;
      })
      .addCase(fetchSingleUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSingleUser.fulfilled, (state, action) => {
        if (
          action.payload !== undefined &&
          action.payload?.status === SUCCESS_CODE
        ) {
          state.user = action.payload.data.data;
          state.loading = false;
          state.error = false;
        }
      })
      .addCase(fetchSingleUser.rejected, (state) => {
        state.user = null;
        state.loading = false;
        state.error = true;
      });
  },
});

export const getUsersData: any = (state: RootState) => state.user;

export default userSlice.reducer;
