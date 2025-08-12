import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { API_PATH } from "../api-services/apiPath";
import { makeApiCall } from "../api-services/makeApiCall";
import { SUCCESS_CODE } from "../utils/constants";

type RoleListType = {
  enable: number;
  id: number;
  role_name: string;
};
// interface type of role values
interface roleState {
  roles: RoleListType[];
  error: boolean;
  loading: boolean;
  role: Object | null;
}

type RoleApiType = {
  type: "forlistingpage" | "fordropdown";
};

// define state value
const initialState: roleState = {
  roles: [],
  error: false,
  loading: false,
  role: null,
};

export const fetchAllRoles = createAsyncThunk(
  "role/fetchAllRoles",
  async (data: RoleApiType, { dispatch }) => {
    const resposne = await dispatch(
      makeApiCall({
        method: "get",
        url: `${API_PATH.GET_ALL_ROLES}?type=${data.type}`,
      })
    );
    return resposne.payload;
  }
);

export const addRole = createAsyncThunk(
  "role/addRole",
  async (data: any, { dispatch }) => {
    const resposne = await dispatch(
      makeApiCall({
        method: "post",
        data,
        url: `${API_PATH.ADD_ROLE}`,
      })
    );
    return resposne.payload;
  }
);

export const updateSingleRole = createAsyncThunk(
  "role/updateSingleRole",
  async (data: any, { dispatch }) => {
    const resposne = await dispatch(
      makeApiCall({
        method: "put",
        url: `${API_PATH.EDIT_ROLE}`,
        data,
      })
    );
    return resposne.payload;
  }
);

export const fetchSingleRole = createAsyncThunk(
  "role/fetchSingleRole",
  async (id: number, { dispatch }) => {
    const resposne = await dispatch(
      makeApiCall({
        method: "get",
        url: `${API_PATH.GET_SINGLE_ROLE}/${id}?type=forgetbyid`,
      })
    );
    return resposne.payload;
  }
);

// create store with auth namespace

export const roleStore = createSlice({
  name: "role",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAllRoles.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllRoles.fulfilled, (state, action) => {
        if (action.payload?.status === SUCCESS_CODE) {
          state.roles = action.payload.data.data;
          state.loading = false;
          state.error = false;
        }
      })
      .addCase(fetchAllRoles.rejected, (state) => {
        state.roles = [];
        state.loading = false;
        state.error = true;
      })
      .addCase(addRole.pending, (state) => {
        state.loading = true;
      })
      .addCase(addRole.fulfilled, (state, action) => {
        if (action.payload?.status === SUCCESS_CODE) {
          state.loading = false;
          state.error = false;
        }
      })
      .addCase(addRole.rejected, (state) => {
        state.error = true;
        state.loading = false;
      })
      .addCase(fetchSingleRole.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSingleRole.fulfilled, (state, action) => {
        if (action.payload?.status === SUCCESS_CODE) {
          state.role = action.payload.data.data;
          state.loading = false;
          state.error = false;
        }
      })
      .addCase(fetchSingleRole.rejected, (state) => {
        state.error = true;
        state.role = null;
        state.loading = false;
      });
  },
});

export const getRolesData = (state: RootState) => state.role;

export default roleStore.reducer;
