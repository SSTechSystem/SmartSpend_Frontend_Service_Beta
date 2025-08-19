import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import darkModeReducer from "./darkModeSlice";
import colorSchemeReducer from "./colorSchemeSlice";
import sideMenuReducer from "./sideMenuSlice";
import authReducer from "./auth";
import toastReducer from "./toastSlice";
import dashboardReducer from "./dashboard";
import roleReducer from "./manageRole";
import permissionReducer from "./managePermission";
import companyReducer from "./company";
import listReducer from "./commonList";
import accountsReducer from "./accounts";
import customerReducer from "./customer";
import logsReducer from "./logs";
import moduleReducer from "./module";
import profileReducer from "./profile";
import feedbackReducer from "./feedback";
import backupReducer from "./backup";
import adminReducer from "./admin";
import cmsReducer from "./cms";

export const store = configureStore({
  reducer: {
    darkMode: darkModeReducer,
    colorScheme: colorSchemeReducer,
    sideMenu: sideMenuReducer,
    auth: authReducer,
    role: roleReducer,
    permission: permissionReducer,
    dashboard: dashboardReducer,
    toast: toastReducer,
    company: companyReducer,
    account: accountsReducer,
    user: customerReducer,
    list: listReducer,
    logs: logsReducer,
    module: moduleReducer,
    profile: profileReducer,
    feedback: feedbackReducer,
    backup: backupReducer,
    admin: adminReducer,
    cms: cmsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
