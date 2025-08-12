import { ChangeEvent } from "react";

export type TextInputState = {
  creditValue: string;
  perJobFees: string;
  radius: string;
};

export type SelectState = {
  invoiceDuration: string;
  driver: string;
  perJobFeeType: string;
};

export type ErrorState = {
  perJobFees: string;
  perJobFeeType: string;
};

export type InitialState = {
  creditValue: string;
  perJobFees: string;
  perJobFeeType: string;
  invoiceDuration: string;
  driver: string;
  radius: string;
};

export interface CompanyBillingInfoProps {
  initFormData: InitialState;
  formErrors: ErrorState;
  handleInputChange: (
    event: ChangeEvent<HTMLInputElement>,
    fieldName: keyof TextInputState
  ) => void;
  handleSelectChange: (
    selectedValue: string,
    fieldName: keyof SelectState
  ) => void;
  isLoading: boolean;
  role: string | null;
}
