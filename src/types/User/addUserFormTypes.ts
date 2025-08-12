import { ChangeEvent } from "react";

export type SelectState = {
  country: string;
  state: string;
  companySelect: string;
  driverSelect: string;
  accountsSelect: string;
  role: string;
  time_zone: string;
};

export type TextInputState = {
  name: string;
  building_name: string;
  street_address: string;
  pincode: string;
  contact_no: string;
  email: string;
  password: string;
  city: string;
  profile_pic: File | null | string;
};

export type ErrorState = {
  name: string;
  building_name: string;
  email: string;
  password: string;
  city: string;
  pincode: string;
  contact_no: string;
  street_address: string;
};

export type ImageState = {
  profile_pic: File | null;
};

export type FormState = SelectState & TextInputState;

export type SelectedRoleType = {
  value: number;
  label: string;
};

export interface UserFormProps {
  initFormData: FormState;
  formErrors: Partial<ErrorState>;
  handleInputChange: (
    event: ChangeEvent<HTMLInputElement>,
    fieldName: keyof TextInputState
  ) => void;
  handleSelectChange: (
    selectedValue: string,
    fieldName: keyof SelectState
  ) => void;
  handleImageChange: (
    event: ChangeEvent<HTMLInputElement>,
    fieldName: keyof TextInputState
  ) => void;
  selectErrors: {
    [key: string]: string;
  };
  setIsCountrySelected: React.Dispatch<React.SetStateAction<boolean>>;
  previewImage: ImageState;
  profileImageError: {
    profile_pic: string;
  };
  isCountrySelected: boolean;
  isRoleSelected: boolean;
  setIsRoleSelected: (value: React.SetStateAction<boolean>) => void;
  isLoading: boolean;
  setSelectedRole: React.Dispatch<
    React.SetStateAction<SelectedRoleType | null>
  >;
  selectedRole: SelectedRoleType | null;
}
