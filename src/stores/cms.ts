import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "./store";
import axios from "axios";
import { API_PATH } from "../api-services/apiPath";
import { displayToast } from "./toastSlice";

// Interface type for CMS values
interface CmsState {
  length: number;
  map(
    arg0: (
      item: {
        VersionNumber:
          | string
          | number
          | boolean
          | React.ReactElement<any, string | React.JSXElementConstructor<any>>
          | Iterable<React.ReactNode>
          | React.ReactPortal
          | null
          | undefined;
        Description:
          | string
          | number
          | boolean
          | React.ReactElement<any, string | React.JSXElementConstructor<any>>
          | Iterable<React.ReactNode>
          | React.ReactPortal
          | null
          | undefined;
        Platform:
          | any
          | string
          | number
          | boolean
          | React.ReactElement<any, string | React.JSXElementConstructor<any>>
          | Iterable<React.ReactNode>
          | React.ReactPortal
          | null
          | undefined;
        IsForceUpdate: any;
      },
      idx: React.Key | null | undefined
    ) => import("react/jsx-runtime").JSX.Element
  ): import("react").ReactNode;
  cmsData: Array<Record<string, any>>;
  error: boolean;
  loading: boolean;
  limit: number;
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  searchText: string;
  status: number | null;
}

// Define initial state
const initialState: CmsState = {
  cmsData: [],
  error: false,
  loading: false,
  limit: 10,
  currentPage: 1,
  totalPages: 1,
  totalRecords: 0,
  searchText: "",
  status: null,
  length: 0,
  map: function (
    arg0: (
      item: {
        VersionNumber:
          | string
          | number
          | boolean
          | React.ReactElement<any, string | React.JSXElementConstructor<any>>
          | Iterable<React.ReactNode>
          | React.ReactPortal
          | null
          | undefined;
        Description:
          | string
          | number
          | boolean
          | React.ReactElement<any, string | React.JSXElementConstructor<any>>
          | Iterable<React.ReactNode>
          | React.ReactPortal
          | null
          | undefined;
        Platform:
          | string
          | number
          | boolean
          | React.ReactElement<any, string | React.JSXElementConstructor<any>>
          | Iterable<React.ReactNode>
          | React.ReactPortal
          | null
          | undefined;
        IsForceUpdate: any;
      },
      idx: React.Key | null | undefined
    ) => import("react/jsx-runtime").JSX.Element
  ): import("react").ReactNode {
    throw new Error("Function not implemented.");
  },
};

// Async thunk for updating a CMS entry
// export const updateCmsEntry = createAsyncThunk(
//   "cms/updateCmsEntry",
//   async (
//     data: {
//       id: number;
//       name?: string;
//       title?: string;
//       description?: string;
//       meta_tags?: string;
//       meta_description?: string;
//       is_release: boolean;
//       version_history?: Array<{
//         id?: number | null;
//         version_no: string;
//         type: string;
//         version_description: string;
//         is_force_update: number;
//         is_created?: number;
//         is_updated?: number;
//         is_deleted?: number;
//       }>;
//     },
//     { dispatch, rejectWithValue }
//   ) => {
//     const headers: Record<string, string> = {
//       Authorization: `Bearer ${localStorage.getItem("token")}`,
//     };
//     // Filter version_history to include only entries with version_no
//     if (data?.version_history?.length !== 0 && data?.is_release) {
//       data.version_history = data?.version_history?.filter(
//         (version) => version.version_no
//       );
//     } else {
//       data.version_history = [];
//     }

//     try {
//       const response = await axios.put(`${API_PATH.EDIT_CMS}`, data, {
//         headers,
//       });

//       dispatch(
//         displayToast({
//           msg: response.data.message || "CMS entry updated successfully.",
//           type: "Success",
//         })
//       );
//       return response.data;
//     } catch (error: any) {
//       dispatch(
//         displayToast({
//           msg: error.response?.data?.message || "Failed to update CMS entry.",
//           type: "Error",
//         })
//       );
//       return rejectWithValue(
//         error.response?.data?.message || "Error updating CMS entry."
//       );
//     }
//   }
// );

// Async thunk for fetching all CMS data
export const fetchAllCmsData = createAsyncThunk(
  "cms/fetchAllCmsData",
  async (data: any, { dispatch }) => {
    let status;
    if (!data?.status) {
      status = null;
    } else {
      if (data.status == "active") {
        status = 1;
      } else {
        status = 0;
      }
    }
    const bodyData: any = {
      limit: data.limit,
      page: data.page,
      search: data.search || "",
      status,
    };

    let headers: Record<string, string> = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    try {
      const response = await axios.get(`${API_PATH.GET_ALL_CMS}`, {
        params: bodyData,
        headers,
      });

      return response.data;
    } catch (error: any) {
      dispatch(
        displayToast({
          msg: error.response?.data?.message || "An error occurred.",
          type: "Error",
        })
      );
      throw error;
    }
  }
);

// Async thunk for adding a new CMS entry
export const addCmsEntry = createAsyncThunk(
  "cms/addCmsEntry",
  async (data: any, { dispatch }) => {
    let version_history: any = [];
    if (data.versionHistory.length > 0) {
      version_history = data.versionHistory
        .filter((version: any) => version.versionNumber)
        .map((version: any) => ({
          version_no: version.versionNumber,
          type: version.platform.toLowerCase(),
          version_description: version.description,
          is_force_update: Number(version.forceupdate),
        }));
    }
    const bodyData: any = {
      name: data.name,
      title: data.title,
      description: data.description,
      meta_tags: data.meta_tags,
      meta_description: data.meta_desctiption,
      version_history,
    };

    let headers: Record<string, string> = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    try {
      const response = await axios.post(`${API_PATH.ADD_CMS}`, bodyData, {
        headers,
      });

      dispatch(
        displayToast({
          msg: response.data.message || "CMS entry added successfully.",
          type: "Success",
        })
      );
      return response.data;
    } catch (error: any) {
      dispatch(
        displayToast({
          msg: error.response?.data?.message || "Failed to add CMS entry.",
          type: "Error",
        })
      );
      throw error;
    }
  }
);

// Async thunk for activating/deactivating a CMS entry
// export const activateDeactivateCmsEntry = createAsyncThunk(
//   "cms/activateDeactivateCmsEntry",
//   async ({ id, status }: { id: number; status: string }, { dispatch }) => {
//     let headers: Record<string, string> = {
//       Authorization: `Bearer ${localStorage.getItem("token")}`,
//     };

//     try {
//       // const response = await axios.get(
//       //   `${API_PATH.ACTIVATE_DEACTIVATE_CMS}/${id}?status=${status}`,
//       //   { headers }
//       // );
//       const response = await axios.get(
//         `${API_PATH.ACTIVATE_DEACTIVATE_CMS}/${id}?status=${status}`,
//         { headers }
//       );

//       dispatch(
//         displayToast({
//           msg: response.data.message || "Operation successful.",
//           type: "Success",
//         })
//       );

//       return { id, status };
//     } catch (error: any) {
//       dispatch(
//         displayToast({
//           msg: error.response?.data?.message || "Operation failed.",
//           type: "Error",
//         })
//       );
//       throw error;
//     }
//   }
// );

export const fetchCmsById = createAsyncThunk(
  "cms/fetchCmsById",
  async (id: number, { rejectWithValue }) => {
    try {
      let headers: Record<string, string> = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };
      const response = await axios.get(`${API_PATH.GET_SINGLE_CMS}/${id}`, {
        headers,
      });

      return response.data.data; // Assuming the API response returns data under "data"
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching CMS by ID"
      );
    }
  }
);

export const deleteCmsEntry = createAsyncThunk(
  "cms/deleteCmsEntry",
  async (id: number, { dispatch }) => {
    let headers: Record<string, string> = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    try {
      const response = await axios.delete(`${API_PATH.DELETE_CMS}/${id}`, {
        headers,
      });

      dispatch(
        displayToast({
          msg: response.data.message || "CMS deleted successfully.",
          type: "Success",
        })
      );

      return { id, success: response.data.success };
    } catch (error: any) {
      dispatch(
        displayToast({
          msg: error.response?.data?.message || "An error occurred.",
          type: "Error",
        })
      );
      throw error;
    }
  }
);

// support.ts
// export const deleteVersionHistory = createAsyncThunk(
//   "cms/deleteVersionHistory",
//   async (data: { cmsId: number; versionHistoryId: number }, { dispatch }) => {
//     let headers: Record<string, string> = {
//       Authorization: `Bearer ${localStorage.getItem("token")}`,
//     };

//     try {
//       const response = await axios.delete(
//         `${API_PATH.DELETE_VERSION_HISTORY}`,
//         {
//           headers,
//           data: {
//             cmsId: data.cmsId,
//             versionHistoryId: data.versionHistoryId,
//           },
//         }
//       );

//       dispatch(
//         displayToast({
//           msg: response.data.message || "Version history deleted successfully.",
//           type: "Success",
//         })
//       );
//       return response.data;
//     } catch (error: any) {
//       dispatch(
//         displayToast({
//           msg:
//             error.response?.data?.message ||
//             "Failed to delete version history.",
//           type: "Error",
//         })
//       );
//       throw error;
//     }
//   }
// );

export const fetchCmsDescription = createAsyncThunk(
  "cms/fetchCmsDescription",
  async (data: { cmsId: number; isRelease: boolean }, { dispatch }) => {
    let headers: Record<string, string> = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };

    try {
      const response = await axios.get(
        `${API_PATH.VIEW_CMS}/${data.cmsId}`,
        // {
        //   cmsId: data.cmsId,
        //   is_release: data.isRelease,
        // },
        { headers }
      );
      return response.data;
    } catch (error: any) {
      dispatch(
        displayToast({
          msg:
            error.response?.data?.message || "Failed to fetch CMS description",
          type: "Error",
        })
      );
      throw error;
    }
  }
);

// Slice definition
export const cmsSlice = createSlice({
  name: "cms",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAllCmsData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllCmsData.fulfilled, (state, action) => {
        if (action.payload !== undefined && action.payload.type === "Success") {
          state.cmsData = action.payload.data.cms_details;
          state.currentPage = action.payload.page;
          state.limit = action.payload.limit;
          state.totalPages = action.payload.totalPages;
          state.totalRecords = action.payload.totalRecords;
          state.loading = false;
          state.error = false;
        }
      })
      .addCase(fetchAllCmsData.rejected, (state) => {
        state.cmsData = [];
        state.loading = false;
        state.error = true;
        state.limit = 10;
        state.currentPage = 1;
        state.totalPages = 1;
        state.totalRecords = 0;
      })
      .addCase(addCmsEntry.pending, (state) => {
        state.loading = true;
      })
      .addCase(addCmsEntry.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        if (action.payload && action.payload.type === "Success") {
          state.cmsData.push(action.payload.data);
        }
      })
      .addCase(addCmsEntry.rejected, (state) => {
        state.loading = false;
        state.error = true;
      })
      // .addCase(activateDeactivateCmsEntry.pending, (state) => {
      //   state.loading = true;
      // })
      // .addCase(activateDeactivateCmsEntry.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.error = false;
      //   const { id, status } = action.payload;
      //   const cmsItem = state.cmsData.find((item) => item.Id === id);
      //   if (cmsItem) {
      //     cmsItem.Active = status === "1" ? 1 : 0;
      //   }
      // })
      // .addCase(activateDeactivateCmsEntry.rejected, (state) => {
      //   state.loading = false;
      //   state.error = true;
      // })
      // .addCase(updateCmsEntry.pending, (state) => {
      //   state.loading = true;
      // })
      // .addCase(updateCmsEntry.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.error = false;
      //   const updatedCms = action.payload.data;
      //   const cmsIndex = state.cmsData.findIndex(
      //     (item) => item.Id === updatedCms.Id
      //   );
      //   if (cmsIndex !== -1) {
      //     state.cmsData[cmsIndex] = updatedCms;
      //   }
      // })
      // .addCase(updateCmsEntry.rejected, (state) => {
      //   state.loading = false;
      //   state.error = true;
      // })
      // .addCase(deleteVersionHistory.pending, (state) => {
      //   state.loading = true;
      // })
      // .addCase(deleteVersionHistory.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.error = false;
      //   const cmsIndex = state.cmsData.findIndex(
      //     (item) => item.Id === action.payload.cmsId
      //   );
      //   if (cmsIndex !== -1) {
      //     state.cmsData[cmsIndex].Version_History =
      //       action.payload.data.Version_History;
      //   }
      // })
      // .addCase(deleteVersionHistory.rejected, (state) => {
      //   state.loading = false;
      //   state.error = true;
      // })
      .addCase(fetchCmsDescription.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCmsDescription.fulfilled, (state, action) => {
        if (action.payload && action.payload.type === "Success") {
          state.cmsData = action.payload?.data?.version_history?.map((item: any) => ({
            VersionNumber: item.title,
            Platform: item.platform === 1 ? "Android" : "iOS",
            Description: item.description,
            IsForceUpdate: item.is_force,
          }));
          state.loading = false;
          state.error = false;
        }
      })
      .addCase(fetchCmsDescription.rejected, (state) => {
        state.cmsData = [];
        state.loading = false;
        state.error = true;
      });
  },
});

// Getter for CMS state
export const getCmsData = (state: RootState) => state.cms;

export default cmsSlice.reducer;
