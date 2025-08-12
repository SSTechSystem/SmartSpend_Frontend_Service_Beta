import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { icons } from "../base-components/Lucide";
import { SUPER_ADMIN } from "../utils/constants";
import secureLocalStorage from "react-secure-storage";
import ManageIcon from "../assets/images/sidemenu-icon/Manage.svg";
import PermissionIcon from "../assets/images/sidemenu-icon/Permission.svg";

export interface Menu {
  icon: keyof typeof icons;
  svgIcon?: any;
  title: string;
  pathname?: string;
  subMenu?: Menu[];
  ignore?: boolean;
  key?: string;
  custom_key?: string;
}

export interface SideMenuState {
  menu: Array<Menu | string>;
  loading: boolean;
}

export const fetchPermissions = createAsyncThunk(
  "permissions/fetch",
  async () => {
    try {
      const role = secureLocalStorage.getItem("role");
      if (role === SUPER_ADMIN) {
        return;
      }
      const permissionsStr = await secureLocalStorage.getItem("permissions");
      const permissions = JSON.parse(permissionsStr ?? ("null" as any));
      return permissions;
    } catch (error) {
      console.error("Error retrieving permissions:", error);
      throw error;
    }
  }
);

const initialState: SideMenuState = {
  menu: [],
  loading: false,
};

export const sideMenuSlice = createSlice({
  name: "sideMenu",
  initialState,
  reducers: {
    removeItemFromLocalStorage: () => {
      secureLocalStorage.removeItem("companyPage");
      secureLocalStorage.removeItem("accountPage");
      secureLocalStorage.removeItem("newlyAddedUser");
      secureLocalStorage.removeItem("newlyAddedCompany");
      secureLocalStorage.removeItem("newlyAddedAccounts");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPermissions.fulfilled, (state, action) => {
      const permissions = action.payload;

      const doesHaveCompanyViewPermission =
        permissions?.company_management?.view;
      const doesHaveAccountViewPermission =
        permissions?.account_management?.view;
      const doesHaveUserViewPermission = permissions?.user_management?.view;

      state.menu = [
        {
          icon: "Home",
          // svgIcon: "",
          title: "Dashboard",
          pathname: "/dashboard",
          custom_key: "dashboard",
        },
        {
          icon: "LayoutDashboard",
          svgIcon: ManageIcon,
          title: "Manage",
          subMenu: [
            (doesHaveCompanyViewPermission ||
              secureLocalStorage.getItem("role") === SUPER_ADMIN) && {
              icon: "Building2",
              // svgIcon: "",
              pathname: "/company",
              title: "Company",
              key: "company_management",
            },
            (doesHaveAccountViewPermission ||
              secureLocalStorage.getItem("role") === SUPER_ADMIN) && {
              icon: "FileBadge",
              // svgIcon: "",
              pathname: "/accounts",
              title: "Accounts",
              key: "account_management",
            },
            (doesHaveUserViewPermission ||
              secureLocalStorage.getItem("role") === SUPER_ADMIN) && {
              icon: "Users",
              // svgIcon: "",
              pathname: "/user",
              title: "Users",
              key: "user_management",
            },
            secureLocalStorage.getItem("role") === SUPER_ADMIN && {
              icon: "Boxes",
              svgIcon: ManageIcon,
              pathname: "/module",
              title: "Modules",
              key: "module",
            },
            secureLocalStorage.getItem("role") === SUPER_ADMIN && {
              icon: "Key",
              svgIcon: PermissionIcon,
              pathname: "/permissions",
              title: "Permissions",
              key: "permissions",
            },
          ].filter(Boolean),
        },
      ];

      if (secureLocalStorage.getItem("role") === SUPER_ADMIN) {
        state.menu.push({
          icon: "TimerReset",
          title: "Logs",
          custom_key: "logs_management",
          subMenu: [
            {
              icon: "Timer",
              pathname: "/api-logs",
              title: "Api Logs",
            },
            {
              icon: "TimerOff",
              pathname: "/system-logs",
              title: "System Logs",
            },
          ],
        });
      }
    });
  },
});

export const selectSideMenu = (state: RootState) => state.sideMenu.menu;

export const { removeItemFromLocalStorage } = sideMenuSlice.actions;

export default sideMenuSlice.reducer;
