import { PayloadAction, createAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface ToastState {
  message: string;
  type: string;
}

interface payloadObj {
  msg: string;
  type: string;
}

const initialState: ToastState = {
  message: "",
  type: "",
};

export const resetToast = createAction("toast/reset");

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    displayToast(state, action: PayloadAction<payloadObj>) {
      state.message = action.payload.msg;
      state.type = action.payload.type;
    },
    hideToast(state) {
      state.message = "";
      state.type = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetToast, (state) => {
      state.message = "";
      state.type = "";
    });
  },
});

export const toastMessage = (state: RootState) => state.toast.message;
export const toastType = (state: RootState) => state.toast.type;

export const { displayToast, hideToast } = toastSlice.actions;
export default toastSlice.reducer;
