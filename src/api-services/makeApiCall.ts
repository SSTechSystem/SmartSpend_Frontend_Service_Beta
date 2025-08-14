import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosRequestConfig, ResponseType } from "axios";
import { displayToast } from "../stores/toastSlice";
import { handleAxiosResponse } from "../utils/helper";
import { hasAccess } from "../utils/checkPermissions";
import { setLogout } from "../stores/auth";
import { UNAUTH_CODE } from "../utils/constants";

interface ApiOptions {
  method: "get" | "post" | "put" | "delete" | "patch";
  url: string;
  headers?: Record<string, string>;
  data?: any;
  params?: any;
  responseType?: ResponseType;
}
let isLoggingOut = false;
export const generateHeaders = async (
  permissionType: string,
  permission?: string
): Promise<Record<string, string>> => {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };
  const permissions = await hasAccess(permissionType);
  if (permission && permissions.includes(permission)) {
    headers["action"] = permission;
  }

  return headers;
};

export const makeApiCall = createAsyncThunk(
  "api/makeApiCall",
  async (options: ApiOptions, { dispatch }) => {
    try {
      const headers = await generateHeaders(
        options.headers?.action ? options.headers?.action : ""
      );

      const response = await axios({
        method: options.method,
        url: options.url,
        headers: { ...options.headers, ...headers },
        data: options.data,
        params: options.params,
        responseType: options.responseType,
      } as AxiosRequestConfig);

      const returnData = handleAxiosResponse(response);
      return returnData;
    } catch (error: any) {
      if (Number(error.response?.status) === Number(UNAUTH_CODE)) {
        localStorage.clear();
        localStorage.removeItem("token");
        window.location.href = "/smartspend/login";
        if (!isLoggingOut) {
          isLoggingOut = true;
          dispatch(setLogout());
        }
      }
      dispatch(
        displayToast({
          msg: error.response.data.message,
          type: "Error",
        })
      );
      return error;
    }
  }
);
