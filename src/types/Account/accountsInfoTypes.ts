import { ChangeEvent } from "react";

export type SelectState = {
  country: string;
  state: string;
  companySelectName?: string;
  time_zone: string;
};

export type TextInputState = {
  name: string;
  description: string;
  building_name: string;
  street_address: string;
  suburb: string;
  pincode: string;
  contact_no: string;
  email: string;
  custom_domain_name: string;
  site_url: string;
  cost_center_name: string;
  port_code: string;
};

export type ErrorState = {
  name: string;
  building_name: string;
  suburb: string;
  contact_no: string;
  pincode: string;
  email: string;
  street_address: string;
  site_url: string;
  time_zone: string;
};

export type FormState = SelectState & TextInputState;

export interface AccountsInfoProps {
  initFormData: FormState;
  companyError: string;
  countryError: string;
  companySelect: string;
  handleCompanySelect: (selectedValue: string) => void;
  countrySelect: string;
  handleCountrySelect: (selectedValue: string) => void;
  setIsCountrySelected: React.Dispatch<React.SetStateAction<boolean>>;
  handleInputChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    fieldName: keyof TextInputState
  ) => void;
  formErrors: Partial<ErrorState>;
  stateSelect: string;
  isCountrySelected: boolean;
  handleStateSelect: (selectedValue: string) => void;
  stateError: string;
  isLoading: boolean;
  handleSelect: (selectedVal: string, fieldName: keyof SelectState) => void;
  timezoneError: string;
}
