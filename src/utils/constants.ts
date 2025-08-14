export const SUPER_ADMIN: string = "Admin";
export const COMPANY_ADMIN: string = "company_admin";
export const COMPANY_STANDARD: string = "company_standard";
export const DRIVER: string = "driver";
export const ACCOUNT: string = "account_admin";
export const ACCOUNT_STANDARD: string = "account_standard";
export const CUSTOMER: string = "customer";
export const SUCCESS_TEXT: string = "Success";
export const ERROR_TEXT: string = "Error";

export const COMPANY_BASIC_DETAIL: string = "basic_detail";
export const COMPANY_BILLING_DETAIL: string = "billing_detail";
export const COMPANY_BALANCE_DETAIL: string = "balance_detail";

export const SUCCESS_CODE = 200;
export const UNAUTH_CODE: number = 401;


export const NAME_REGEX = /^[a-zA-Z]+(?:\s*[a-zA-Z]+)*$/;
export const USERNAME_REGEX =
  /^[a-zA-Z0-9]+(?:[a-zA-Z0-9\s-]*[a-zA-Z0-9])*(?<![-\s])$/;
export const EMAIL_REGEX =
  /^[^\s-]([\w.-]*[^\s-])?@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
// export const ADDRESS_REGEX =
//   /^[a-zA-Z0-9]+(?:[\/.,'\s+-]*[a-zA-Z0-9]+)*(?<![\s\/.,-])$/;
export const ADDRESS_REGEX =
  /^[a-zA-Z0-9]+(?:[\/.,'()&\s+-]*[a-zA-Z0-9]+)*(?<![\s\/.,()-])$/;
// export const POSTCODE_REGEX = /^[a-zA-Z0-9]+(?:[\s-][a-zA-Z0-9]+)*(?<![ -])$/;
export const POSTCODE_REGEX = /^[a-zA-Z0-9]+(?:[-]?[a-zA-Z0-9]+)*$/;
// export const PHONE_REGEX = /^\+?\d[\d ()-]{8,20}\d$/;
export const PHONE_REGEX = /^\+?\d[\d()-]{6,13}\d$/;
// export const PHONE_REGEX = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
export const PREFIX_REGEX = /^[a-zA-Z]+$/;
export const API_URL_REGEX =
  /^(?:(https?:\/\/)?(?:[a-zA-Z0-9](?:[a-zA-Z0-9.-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(?::\d+)?(?:\/[a-zA-Z0-9/?=&_-]+)?)|(www\.[a-zA-Z0-9](?:[a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}(?:\/[a-zA-Z0-9/?=&_-]+)?)$/;

export const DATE_TIME_FORMAT = "MM/DD/YYYY hh:mm a";

export interface ListOptions {
  name: string;
  id: number;
}

export const PAGE_LIMIT = 25;
export const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 75, 100];
