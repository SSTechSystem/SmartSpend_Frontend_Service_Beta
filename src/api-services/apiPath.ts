const API_BASE_URL = import.meta.env.VITE_REACT_APP_BASE_RULE;

export const API_PATH = {
  //Authentication
  SIGN_IN: `${API_BASE_URL}/signin`,
  SIGN_OUT: `${API_BASE_URL}/signout`,
  FORGET_PASSWORD: `${API_BASE_URL}/forgot-password`,
  RESET_PASSWORD: `${API_BASE_URL}/reset-password`,
  CHANGE_PASSWORD: `${API_BASE_URL}/change-password`,

  //Dashboard 
  GET_DASHBOARD_DATA: `${API_BASE_URL}/dashboard`,

  //Profile
  GET_PROFILE_DATA: `${API_BASE_URL}/profile`,
  UPDATE_PROFILE_DATA: `${API_BASE_URL}/update-profile`,

  //Customer
  GET_ALL_CUSTOMERS: `${API_BASE_URL}/customers`,

  //Admin
  GET_ALL_ADMIN: `${API_BASE_URL}/admins`,
  GET_SINGLE_ADMIN: `${API_BASE_URL}/admin-details`,
  DELETE_ADMIN: `${API_BASE_URL}/admin-delete`,
  UPDATE_ADMIN: `${API_BASE_URL}/admin-add-or-edit`,

  //Roles
  GET_ALL_ROLES: `${API_BASE_URL}/roles`,

  //Feedback
  GET_ALL_FEEDBACKS: `${API_BASE_URL}/feedbacks`,

  //Backup
  GET_ALL_BACKUPS: `${API_BASE_URL}/backups`,

  //CMS
  GET_ALL_CMS: `${API_BASE_URL}/cms`,
  GET_SINGLE_CMS: `${API_BASE_URL}/cms-details`,
  DELETE_CMS: `${API_BASE_URL}/delete-cms`,
  ADD_CMS: `${API_BASE_URL}/add-cms`,
  UPDATE_CMS: `${API_BASE_URL}/edit-cms`,
  VIEW_CMS: `${API_BASE_URL}/view-cms`,
  DELETE_VERSION_HISTORY: `${API_BASE_URL}/delete-version-history`,

  //Permissions
  PERMISSIONS_URL: `${API_BASE_URL}`,

  //User
  GET_ALL_USERS: `${API_BASE_URL}/getall`,
  DELETE_USER: `${API_BASE_URL}/delete`,
  ADD_USER: `${API_BASE_URL}/add-or-edit`,
  GET_SINGLE_USER: `${API_BASE_URL}/get`,
  UPDATE_USER_PROFILE: `${API_BASE_URL}/edit-profile`,
  VERIFY_USER: `${API_BASE_URL}/email-verify`,
  CHANGE_USER_STATUS: `${API_BASE_URL}/change-status`,
  RESEND_VERIFICATION_EMAIL: `${API_BASE_URL}/resend-verification-email`,

  //Logs
  GET_ALL_API_LOGS: `${API_BASE_URL}/getall-apilogs`,
  GET_SINGLE_API_LOG: `${API_BASE_URL}/get-apilog`,
  GET_ALL_SYSTEM_LOGS: `${API_BASE_URL}/getall-adminlogs`,
  GET_SINGLE_SYSTEM_LOG: `${API_BASE_URL}/get-adminlog`,
  GET_MODULE_DROPDOWN: `${API_BASE_URL}/get-module`,

  //Get Country List
  GET_ALL_COUNTRIES: `${API_BASE_URL}/get-country`,
  GET_STATES: `${API_BASE_URL}/get-state`,
  GET_CURRENCY: `${API_BASE_URL}/get-currency`,
  GET_DRIVER_LIST_DROPDOWN: `${API_BASE_URL}/get-list`,
};
