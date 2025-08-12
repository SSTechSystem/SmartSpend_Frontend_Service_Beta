const API_AUTH_URL = import.meta.env.VITE_REACT_APP_AUTH_SERVICE;
const API_ROLE_URL = import.meta.env.VITE_REACT_APP_ROLL_SERVICE;
const API_PERMISSION_URL = import.meta.env.VITE_REACT_APP_PERMISSION_SERVICE;
const API_COMPANY_URL = import.meta.env.VITE_REACT_APP_COMPANY_SERVICE;
const API_USER_URL = import.meta.env.VITE_REACT_APP_USER_SERVICE;
const API_ACCOUNTS_URL = import.meta.env.VITE_REACT_APP_ACCOUNTS_SERVICE;
const API_COMMON_URL = import.meta.env.VITE_REACT_APP_COMMON_SERVICE;
const API_LOGS_URL = import.meta.env.VITE_REACT_APP_LOGS_SERVICE;
const API_DRIVER_URL = import.meta.env.VITE_REACT_APP_DRIVER_SERVICE;
const API_MODULE_URL = import.meta.env.VITE_REACT_APP_MODULE_SERVICE;

export const API_PATH = {
  //Authentication
  SIGN_IN: `${API_AUTH_URL}/signin`,
  SIGN_OUT: `${API_AUTH_URL}/logout`,
  FORGET_PASSWORD: `${API_AUTH_URL}/forgot-password`,
  RESET_PASSWORD: `${API_AUTH_URL}/reset-password`,

  //Dashboard
  GET_DASHBOARD_DATA: `${API_AUTH_URL}/me`,

  //Roles
  GET_ALL_ROLES: `${API_ROLE_URL}/getall`,
  GET_SINGLE_ROLE: `${API_ROLE_URL}/get`,
  ADD_ROLE: `${API_ROLE_URL}/create`,
  EDIT_ROLE: `${API_ROLE_URL}/update`,

  //Permissions
  PERMISSIONS_URL: `${API_PERMISSION_URL}`,

  //Company
  GET_ALL_COMPANIES: `${API_COMPANY_URL}/getall`,
  ADD_COMPANY: `${API_COMPANY_URL}/add-or-edit`,
  GET_COMPANY_CODE: `${API_COMPANY_URL}/get-next-company-code`,
  GET_SINGLE_COMPANY: `${API_COMPANY_URL}/get`,
  DELETE_COMPANY: `${API_COMPANY_URL}/delete`,
  GET_COMPANY_DROPDOWN: `${API_COMPANY_URL}/get-company-list`,
  ADD_COMPANY_BILLING: `${API_COMPANY_URL}/edit-billing`,
  CHANGE_COMPANY_STATUS: `${API_COMPANY_URL}/change-status`,

  //Accounts
  GET_ALL_ACCOUNTS: `${API_ACCOUNTS_URL}/getall`,
  DELETE_ACCOUNT: `${API_ACCOUNTS_URL}/delete`,
  ADD_ACCOUNT: `${API_ACCOUNTS_URL}/add-or-edit`,
  GET_SINGLE_ACCOUNT: `${API_ACCOUNTS_URL}/get`,
  GET_ACCOUNT_DROPDOWN: `${API_ACCOUNTS_URL}/get-list`,
  CHANGE_ACCOUNT_STATUS: `${API_ACCOUNTS_URL}/change-status`,

  //User
  GET_ALL_USERS: `${API_USER_URL}/getall`,
  DELETE_USER: `${API_USER_URL}/delete`,
  ADD_USER: `${API_USER_URL}/add-or-edit`,
  GET_SINGLE_USER: `${API_USER_URL}/get`,
  UPDATE_USER_PROFILE: `${API_USER_URL}/edit-profile`,
  VERIFY_USER: `${API_USER_URL}/email-verify`,
  CHANGE_USER_STATUS: `${API_USER_URL}/change-status`,
  RESEND_VERIFICATION_EMAIL: `${API_USER_URL}/resend-verification-email`,

  //Modules
  GET_MODULES_LIST: `${API_MODULE_URL}/getall`,
  GET_SINGLE_MODULE: `${API_MODULE_URL}/get`,
  ADD_MODULE: `${API_MODULE_URL}/add`,
  EDIT_MODULE: `${API_MODULE_URL}/edit`,
  DELETE_MODULE: `${API_MODULE_URL}/delete`,

  //Logs
  GET_ALL_API_LOGS: `${API_LOGS_URL}/getall-apilogs`,
  GET_SINGLE_API_LOG: `${API_LOGS_URL}/get-apilog`,
  GET_ALL_SYSTEM_LOGS: `${API_LOGS_URL}/getall-adminlogs`,
  GET_SINGLE_SYSTEM_LOG: `${API_LOGS_URL}/get-adminlog`,
  GET_MODULE_DROPDOWN: `${API_LOGS_URL}/get-module`,

  //Get Country List
  GET_ALL_COUNTRIES: `${API_COMMON_URL}/get-country`,
  GET_STATES: `${API_COMMON_URL}/get-state`,
  GET_CURRENCY: `${API_COMMON_URL}/get-currency`,
  GET_DRIVER_LIST_DROPDOWN: `${API_DRIVER_URL}/get-list`,
};
