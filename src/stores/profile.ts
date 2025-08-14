import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { makeApiCall } from "../api-services/makeApiCall";
import { API_PATH } from "../api-services/apiPath";
import { SUCCESS_CODE } from "../utils/constants";
import { RootState } from "./store";

// interface type of profile values
interface ProfileState {
    id: number | null;
    name: string;
    email: string;
    phone: string;
    error: any;
};

// define state value
const initialState: ProfileState = {
    id: null,
    name: "",
    email: "",
    phone: "",
    error: null
};

export const setProfileData = createAsyncThunk(
    "profile/setProfileData",
    async (_,{ dispatch }) => {
        const response = await dispatch(
            makeApiCall({
                method: "get",
                url: `${API_PATH.GET_PROFILE_DATA}`,
                data: {},
            })
        );
        return response.payload;
    }
);

export const updateProfile = createAsyncThunk(
    "profile/updateProfile",
    async (data : any,{ dispatch }) => {
        const response = await dispatch(
            makeApiCall({
                method: "patch",
                url: `${API_PATH.UPDATE_PROFILE_DATA}`,
                data,
            })
        );
        return response.payload;
    }
);

export const profileStore = createSlice({
    name: "profile",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
          .addCase(setProfileData.fulfilled, (state,action) => {
            if(action.payload?.status === SUCCESS_CODE) {
                state.id = action.payload.data.data.Id;
                state.name = action.payload.data.data.Name;
                state.email = action.payload.data.data.Email;
                state.phone = action.payload.data.data.Phone;
            }   
            })
          .addCase(setProfileData.rejected,(state,action) => {
            state.error = action.error.message;
          })
    },
});


export const getProfileData = (state: RootState) => state.profile;

export default profileStore.reducer;