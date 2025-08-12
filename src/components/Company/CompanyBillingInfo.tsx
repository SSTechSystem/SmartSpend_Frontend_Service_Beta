import React, { useEffect, ChangeEvent, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import {
  editCompanyBillingInfo,
  fetchSingleCompany,
  getCompaniesData,
} from "../../stores/company";
import { COMPANY_BILLING_DETAIL, SUCCESS_CODE } from "../../utils/constants";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  ErrorState,
  InitialState,
  SelectState,
  TextInputState,
} from "../../types/Company/companyBillingInfoTypes";
import CompanyBillingInfoJsx from "./CompanyBillingInfoJsx";
import CustomLoader from "../Loader/CustomLoader";
import secureLocalStorage from "react-secure-storage";

interface StepThreeProps {
  setPage?: (page: string) => void;
  nextPage: (page: string) => void;
}

const initialState: InitialState = {
  creditValue: "",
  perJobFees: "",
  driver: "1",
  invoiceDuration: "2",
  radius: "",
  perJobFeeType: "fix",
};

const CompanyBillingInfo: React.FC<StepThreeProps> = ({
  nextPage,
  setPage,
}) => {
  const [initFormData, setInitFormData] = useState<InitialState>({
    ...initialState,
  });
  const [formErrors, setFormErrors] = useState<ErrorState>({
    perJobFees: "",
    perJobFeeType: "",
  });
  const role = secureLocalStorage.getItem("role");
  const isCompanyAdded = secureLocalStorage.getItem("newlyAddedCompany");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { company }: any = useAppSelector(getCompaniesData);

  useEffect(() => {
    const fetchCompanyBillingInfo = async () => {
      if (isCompanyAdded) {
        setIsDataLoaded(true);
        await dispatch(
          fetchSingleCompany({
            id: isCompanyAdded as any,
            type: COMPANY_BILLING_DETAIL,
          })
        );
        setIsDataLoaded(false);
      }
    };
    fetchCompanyBillingInfo();
  }, [isCompanyAdded]);

  useEffect(() => {
    const removeItemFromLocalStorage = () => {
      secureLocalStorage.removeItem("newlyAddedCompany");
      secureLocalStorage.removeItem("companyPage");
    };
    if (isCompanyAdded || secureLocalStorage.getItem("companyPage")) {
      window.addEventListener("popstate", removeItemFromLocalStorage);

      return () => {
        window.removeEventListener("popstate", removeItemFromLocalStorage);
      };
    }
  }, [isCompanyAdded]);

  useEffect(() => {
    if (company !== null && isCompanyAdded) {
      setInitFormData((prev) => ({
        ...prev,
        creditValue: company.default_credit_value || "",
        driver: company.allow_driver?.toString() || "1",
        invoiceDuration: company.invoice_type || "2",
        perJobFees: company.per_job_fee || "",
        perJobFeeType: company.per_job_fee_type || "fix",
        radius: company.radius || "",
      }));
    }
  }, [company, isCompanyAdded]);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    fieldName: keyof TextInputState
  ) => {
    const { value } = event.target;
    if (fieldName === "creditValue") {
      setInitFormData((prev) => ({
        ...prev,
        creditValue: value ? value : "",
      }));
    } else if (fieldName === "perJobFees") {
      setInitFormData((prev) => ({
        ...prev,
        perJobFees: value ? value : "",
      }));
      setFormErrors((prev) => ({
        ...prev,
        perJobFees: value
          ? Number(value) < 1
            ? "Per Job Fees can not be negative or zero"
            : ""
          : "Per Job Fees is required",
      }));
    } else {
      setInitFormData((prev) => ({
        ...prev,
        [fieldName]: value,
      }));
    }
  };

  const handleSelectChange = (
    selectedValue: string,
    fieldName: keyof SelectState
  ) => {
    setInitFormData((prev) => ({
      ...prev,
      [fieldName]: selectedValue,
    }));
    if (fieldName === "perJobFeeType") {
      setFormErrors((prev) => ({
        ...prev,
        perJobFeeType: selectedValue ? "" : "This field is required",
      }));
    }
  };

  const submitCompanyBillingInfo = async (
    e: React.ChangeEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const errors: ErrorState = {
      perJobFees: "",
      perJobFeeType: "",
    };
    if (!initFormData.perJobFees) {
      errors.perJobFees = "Per Job Fees is required";
    } else if (Number(initFormData.perJobFees) < 1) {
      errors.perJobFees = "Per Job Fees can not be negative or zero";
    }
    if (!initFormData.perJobFeeType) {
      errors.perJobFeeType = "This field is required";
    }
    setFormErrors(errors);
    if (Object.values(errors).some((err) => err !== "")) {
      return;
    } else {
      const payload = {
        company_id: isCompanyAdded,
        default_credit_value: initFormData.creditValue
          ? Number(initFormData.creditValue)
          : 0,
        per_job_fee: initFormData.perJobFees,
        per_job_fee_type: initFormData.perJobFeeType,
        invoice_type: initFormData.invoiceDuration,
        allow_driver: initFormData.driver,
        radius: initFormData.radius ? Number(initFormData.radius) : 0,
      };
      try {
        setIsLoading(true);
        const res = await dispatch(editCompanyBillingInfo(payload));
        if (res.payload?.status === SUCCESS_CODE) {
          toast.success(
            res.payload.data?.message || "Details updated successfully.."
          );
          secureLocalStorage.removeItem("newlyAddedCompany");
          secureLocalStorage.removeItem("companyPage");
          navigate("/company");
        } else {
          return toast.error(
            res.payload?.response?.data?.message || "Something went wrong"
          );
        }
      } catch (error) {
        console.log("Err--", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      {isDataLoaded ? (
        <CustomLoader color="fill-lime-600" />
      ) : (
        <>
          <form
            className="grid grid-cols-12 gap-4 mt-3"
            name="companyBillingInfo"
            onSubmit={submitCompanyBillingInfo}
          >
            <CompanyBillingInfoJsx
              formErrors={formErrors}
              handleInputChange={handleInputChange}
              handleSelectChange={handleSelectChange}
              initFormData={initFormData}
              isLoading={isLoading}
              role={role as any}
            />
          </form>
        </>
      )}
    </>
  );
};

export default CompanyBillingInfo;
