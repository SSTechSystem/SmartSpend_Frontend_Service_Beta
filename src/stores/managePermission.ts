import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { API_PATH } from "../api-services/apiPath";
import { makeApiCall } from "../api-services/makeApiCall";
import { SUCCESS_CODE } from "../utils/constants";

// interface type of permission values
interface roleState {
  permissions: Object | null;
  error: boolean;
  loading: boolean;
  permission: Object | null;
  role_name: string;
}

// define state value
const initialState: roleState = {
  permissions: null,
  error: false,
  loading: false,
  permission: null,
  role_name: "",
};

export const fetchAllPermissions = createAsyncThunk(
  "permission/fetchAllPermissions",
  async (_, { dispatch }) => {
    const resposne = await dispatch(
      makeApiCall({
        method: "get",
        url: `${API_PATH.PERMISSIONS_URL}/get-all-perm`,
      })
    );
    return resposne.payload;
  }
);

export const updatePermission = createAsyncThunk(
  "permission/updatePermission",
  async (data: any, { dispatch }) => {
    const resposne = await dispatch(
      makeApiCall({
        method: "put",
        url: `${API_PATH.PERMISSIONS_URL}/edit-role-perm`,
        data,
      })
    );
    return resposne.payload;
  }
);

export const fetchSingleModulePermission = createAsyncThunk(
  "permission/fetchSingleModulePermission",
  async (id: number, { dispatch }) => {
    const resposne = await dispatch(
      makeApiCall({
        method: "get",
        url: `${API_PATH.PERMISSIONS_URL}/get-role-perm?role_id=${id}`,
      })
    );
    return resposne.payload;
  }
);

// create store with auth namespace

export const roleStore = createSlice({
  name: "permission",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAllPermissions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllPermissions.fulfilled, (state, action) => {
        if (action.payload?.status === SUCCESS_CODE) {
          state.permissions = action.payload.data.data;
          state.loading = false;
          state.error = false;
        }
      })
      .addCase(fetchAllPermissions.rejected, (state) => {
        state.permissions = null;
        state.loading = false;
        state.error = true;
      })
      .addCase(fetchSingleModulePermission.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSingleModulePermission.fulfilled, (state, action) => {
        if (action.payload?.status === SUCCESS_CODE) {
          state.permission = action.payload.data.data.permissions;
          state.role_name = action.payload.data.data.role_name;
          state.loading = false;
          state.error = false;
        }
      })
      .addCase(fetchSingleModulePermission.rejected, (state) => {
        state.error = true;
        state.permission = null;
        state.role_name = "";
        state.loading = false;
      });
  },
});

export const getPermissionsData: any = (state: RootState) =>
  state.permission.permissions;
export const getSomePermissionsData: any = (state: RootState) =>
  state.permission.permission;
export const getRoleNameData = (state: RootState) => state.permission.role_name;

export default roleStore.reducer;
