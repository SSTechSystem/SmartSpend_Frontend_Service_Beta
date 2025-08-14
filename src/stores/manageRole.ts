import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { API_PATH } from "../api-services/apiPath";
import { makeApiCall } from "../api-services/makeApiCall";
import { SUCCESS_CODE } from "../utils/constants";

type RoleListType = {
  enable: number;
  id: number;
  name: string;
};
// interface type of role values
interface roleState {
  roles: RoleListType[];
  error: boolean;
  loading: boolean;
  role: Object | null;
}

// define state value
const initialState: roleState = {
  roles: [],
  error: false,
  loading: false,
  role: null,
};

export const fetchAllRoles = createAsyncThunk(
  "role/fetchAllRoles",
  async (_, { dispatch }) => {
    const resposne = await dispatch(
      makeApiCall({
        method: "get",
        url: `${API_PATH.GET_ALL_ROLES}`,
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
  },
});

export const getRolesData = (state: RootState) => state.role;

export default roleStore.reducer;
