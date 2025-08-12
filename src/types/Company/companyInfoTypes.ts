import { ChangeEvent } from "react";

export type ErrorState = {
  name: string;
  building_name: string;
  city: string;
  zipcode: string;
  help_line_number: string;
  email: string;
  company_prefix: string;
  street_address: string;
};

export type SelectState = {
  country: string;
  state: string;
  company_currency: string;
  time_zone: string;
  industry_type: string;
  // is_root_company: boolean;
};

export type TextInputState = {
  name: string;
  description: string;
  building_name: string;
  street_address: string;
  city: string;
  zipcode: string;
  help_line_number: string;
  email: string;
  company_prefix: string;
  company_code: string;
  is_parcel_scan_require: boolean;
};

export type FormState = SelectState & TextInputState;

export type SelectErrors = {
  country: string;
  state: string;
  time_zone: string;
  company_currency: string;
};

export interface CompanyInfoProps {
  initFormData: FormState;
  // handleSelectCheckbox: (event: ChangeEvent<HTMLInputElement>) => void;
  formErrors: Partial<ErrorState>;
  handleInputChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    fieldName: keyof TextInputState
  ) => void;
  countrySelect: string;
  selectErrors: SelectErrors;
  handleCountrySelect: (selectedValue: string) => void;
  setIsCountrySelected: React.Dispatch<React.SetStateAction<boolean>>;
  stateSelect: string;
  isCountrySelected: boolean;
  handleStateSelect: (selectedValue: string) => void;
  handleSelectChange: (
    selectedValue: string,
    fieldName: keyof SelectState
  ) => void;
  isLoading: boolean;
}

export type ListOptions = {
  name: string;
  id: number;
};

export type CurrencyOptions = {
  currency_code: string;
  id: number;
};
