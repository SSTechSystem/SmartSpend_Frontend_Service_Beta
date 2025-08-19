import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { icons } from "../base-components/Lucide";
import secureLocalStorage from "react-secure-storage";

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

const initialState: SideMenuState = {
  menu: [
    {
      icon: "Home",
      title: "Dashboard",
      pathname: "/",
      custom_key: "dashboard",
    },
    { 
      icon: "ShieldUser",
      title: "Admins",
      pathname: "/admins",
      custom_key: "changepassword",
    },
    {
      icon: "Users",
      title: "Customers",
      pathname: "/customers",
      custom_key: "customers",
    },
    {
      icon: "MessageCircle",
      title: "Feedbacks",
      pathname: "/feedbacks",
      custom_key: "feedbacks",
    },
    {
      icon: "DatabaseBackup",
      title: "Backups",
      pathname: "/backups",
      custom_key: "backups",
    },
    {
      icon: "RotateCcwKey",
      title: "Change Password",
      pathname: "/changepassword",
      custom_key: "changepassword",
    },
    {
      icon: "Settings",
      title: "CMS",
      pathname: "/cms",
      custom_key: "changepassword",
    },
  ].filter(Boolean) as Menu[],
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
});

export const selectSideMenu = (state: RootState) => state.sideMenu.menu;

export const { removeItemFromLocalStorage } = sideMenuSlice.actions;

export default sideMenuSlice.reducer;
