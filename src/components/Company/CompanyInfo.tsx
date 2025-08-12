import React, { ChangeEvent, useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import {
  fetchAllCountries,
  fetchAllStates,
  fetchCurrency,
} from "../../stores/commonList";
import {
  addCompany,
  editCompany,
  fetchCompanyCode,
  fetchSingleCompany,
  getCompaniesData,
} from "../../stores/company";
import { validateCompanyInfo } from "../../utils/validations";
import { toast } from "react-toastify";
import { COMPANY_BASIC_DETAIL, SUCCESS_CODE } from "../../utils/constants";
import {
  ErrorState,
  FormState,
  SelectErrors,
  SelectState,
  TextInputState,
} from "../../types/Company/companyInfoTypes";
import CompanyInfoJsx from "./CompanyInfoJsx";
import CustomLoader from "../Loader/CustomLoader";
import secureLocalStorage from "react-secure-storage";

interface StepOneProps {
  nextPage: (page: string) => void;
  setPage: (page: string) => void;
}

const initialState = {
  // is_root_company: false,
  name: "",
  description: "",
  building_name: "",
  street_address: "",
  city: "",
  state: "",
  country: "",
  zipcode: "",
  email: "",
  company_prefix: "",
  company_currency: "",
  time_zone: "",
  help_line_number: "",
  company_code: "",
  is_parcel_scan_require: false,
  industry_type: "",
};

const CompanyInfo: React.FC<StepOneProps> = ({ nextPage, setPage }) => {
  const [initFormData, setInitFormData] = useState<FormState>({
    ...initialState,
  });
  const [isCountrySelected, setIsCountrySelected] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { companyCode }: any = useAppSelector(getCompaniesData);
  const { company }: any = useAppSelector(getCompaniesData);
  const isCompanyAdded = secureLocalStorage.getItem("newlyAddedCompany");
  const [formErrors, setFormErrors] = useState<Partial<ErrorState>>({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [countrySelect, setCountrySelect] = useState<string>("");
  const [stateSelect, setStateSelect] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
  const [selectErrors, setSelectErrors] = useState<SelectErrors>({
    country: "",
    state: "",
    time_zone: "",
    company_currency: "",
  });

  useEffect(() => {
    dispatch(fetchAllCountries());
    dispatch(fetchCurrency());
    if (!isCompanyAdded) {
      dispatch(fetchCompanyCode());
    }
  }, []);

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
    setIsFormValid(Object.keys(formErrors).length === 0);
  }, [formErrors]);

  useEffect(() => {
    if (countrySelect !== undefined) {
      if (countrySelect !== "") {
        dispatch(
          fetchAllStates({
            country_id: Number(countrySelect),
          })
        );
      }
    }
  }, [countrySelect]);

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      if (isCompanyAdded) {
        setIsDataLoaded(true);
        await dispatch(
          fetchSingleCompany({
            id: isCompanyAdded as any,
            type: COMPANY_BASIC_DETAIL,
          })
        );
        setIsDataLoaded(false);
      }
    };
    fetchCompanyInfo();
  }, []);

  useEffect(() => {
    if (company !== null && isCompanyAdded) {
      setIsCountrySelected(true);
      setInitFormData((prev) => ({
        ...prev,
        // is_root_company: company.is_root_company,
        company_code: company.company_code,
        name: company.name,
        description: company.description,
        building_name: company.building_name,
        street_address: company.street_address,
        city: company.city,
        zipcode: company.zipcode,
        help_line_number: company.help_line_number,
        email: company.email,
        time_zone: company.time_zone,
        company_currency: company.company_currency,
        company_prefix: company.company_prefix,
        is_parcel_scan_require: company.is_parcel_scan_require || false,
        industry_type: company.industry_type || "",
      }));
      setCountrySelect(company.country);
      setStateSelect(company.state);
    }
  }, [company, isCompanyAdded]);

  const handleChange = (key: string, value: string) => {
    const formData = new FormData(
      document.getElementById("myForm") as HTMLFormElement
    );
    formData.set(key, value);
    let errors = validateCompanyInfo(formData);
    if (isCompanyAdded) delete errors.company_prefix;
    setFormErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0);
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    fieldName: keyof TextInputState
  ) => {
    const { value } = event.target;
    const { checked } = event.target as HTMLInputElement;
    if (fieldName === "is_parcel_scan_require") {
      setInitFormData((prev) => ({
        ...prev,
        is_parcel_scan_require: checked,
      }));
    } else if (fieldName === "company_prefix") {
      setInitFormData((prev) => ({
        ...prev,
        company_prefix: value.toLocaleUpperCase(),
      }));
    } else {
      setInitFormData((prevState) => ({ ...prevState, [fieldName]: value }));
    }
    handleChange(fieldName, value);
  };

  const handleCountrySelect = (selectedValue: string) => {
    setCountrySelect(selectedValue);
    setStateSelect("");
    if (!selectedValue) {
      setInitFormData((prev) => ({ ...prev, city: "" }));
      setSelectErrors((prev) => ({ ...prev, country: "Country is required" }));
    } else {
      setSelectErrors((prev) => ({ ...prev, country: "" }));
    }
  };

  const handleStateSelect = (selectedValue: string) => {
    setStateSelect(selectedValue);
    if (!selectedValue) {
      setSelectErrors((prevErrors) => ({
        ...prevErrors,
        state: "State is required",
      }));
    } else {
      setSelectErrors((prevErrors) => ({ ...prevErrors, state: "" }));
    }
  };

  const handleSelectChange = (
    selectedValue: string,
    fieldName: keyof SelectState
  ) => {
    setInitFormData((prevState) => ({
      ...prevState,
      [fieldName]: selectedValue,
    }));
    if (fieldName === "time_zone") {
      if (!selectedValue) {
        setSelectErrors((prevErrors) => ({
          ...prevErrors,
          time_zone: "Time Zone is required",
        }));
      } else {
        setSelectErrors((prevErrors) => ({ ...prevErrors, time_zone: "" }));
      }
    }
    if (fieldName === "company_currency") {
      if (!selectedValue) {
        setSelectErrors((prevErrors) => ({
          ...prevErrors,
          company_currency: "Currency is required",
        }));
      } else {
        setSelectErrors((prevErrors) => ({
          ...prevErrors,
          company_currency: "",
        }));
      }
    }
  };

  // const handleSelectCheckbox = (event: ChangeEvent<HTMLInputElement>) => {
  //   const { checked } = event.target;
  //   setInitFormData((prev) => ({
  //     ...prev,
  //     is_root_company: checked,
  //   }));
  // };

  const submitCompanyInfo = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const errors = validateCompanyInfo(formData);
    if (isCompanyAdded) delete errors.company_prefix;
    setFormErrors(errors);
    if (!countrySelect) {
      setSelectErrors((prevErrors) => ({
        ...prevErrors,
        country: "Country is required",
      }));
    }
    if (!stateSelect) {
      setSelectErrors((prevErrors) => ({
        ...prevErrors,
        state: "State is required",
      }));
    }
    if (!initFormData.company_currency) {
      setSelectErrors((prevErrors) => ({
        ...prevErrors,
        company_currency: "Currency is required",
      }));
    }
    if (!initFormData.time_zone) {
      setSelectErrors((prevErrors) => ({
        ...prevErrors,
        time_zone: "Time Zone is required",
      }));
    }
    if (
      !stateSelect ||
      !countrySelect ||
      !initFormData.time_zone ||
      !initFormData.company_currency
    ) {
      return toast.error("Please fill all the required fields.");
    }
    if (
      Object.keys(errors).length === 0 &&
      selectErrors.country === "" &&
      selectErrors.state === "" &&
      selectErrors.company_currency === "" &&
      selectErrors.time_zone === ""
    ) {
      const payload = {
        building_name: initFormData.building_name,
        city: initFormData.city,
        company_currency: initFormData.company_currency,
        description: initFormData.description,
        email: initFormData.email,
        help_line_number: initFormData.help_line_number,
        // is_root_company: initFormData.is_root_company,
        name: initFormData.name,
        street_address: initFormData.street_address,
        time_zone: initFormData.time_zone,
        zipcode: initFormData.zipcode,
        company_code: companyCode ? companyCode : initFormData.company_code,
        country: countrySelect,
        state: stateSelect,
        is_parcel_scan_require: initFormData.is_parcel_scan_require,
        industry_type: initFormData.industry_type,
        ...(!isCompanyAdded && {
          company_prefix: initFormData.company_prefix.toLocaleUpperCase(),
        }),
      };
      if (isCompanyAdded) {
        try {
          setIsLoading(true);
          const res = await dispatch(
            editCompany({
              ...payload,
              id: isCompanyAdded,
              email: initFormData.email.toLocaleLowerCase(),
            })
          );
          if (res.payload?.status === SUCCESS_CODE) {
            toast.success(
              res.payload.data?.message || "Company updated successfully"
            );
            setPage("2");
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
      } else {
        try {
          setIsLoading(true);
          const res = await dispatch(
            addCompany({
              ...payload,
              email: initFormData.email.toLocaleLowerCase(),
            })
          );
          if (res.payload?.status === SUCCESS_CODE) {
            toast.success(
              res.payload.data?.message || "Company created successfully"
            );
            secureLocalStorage.setItem(
              "newlyAddedCompany",
              res.payload.data.data?.last_insert_id
            );
            setPage("2");
          } else {
            return toast.error(
              res.payload.response?.data?.message || "Something went wrong"
            );
          }
        } catch (error) {
          console.log("Err-", error);
        } finally {
          setIsLoading(false);
        }
      }
    }
  };
  return (
    <>
      {isDataLoaded ? (
        <CustomLoader color="fill-teal-600" />
      ) : (
        <form
          className="grid grid-cols-12 gap-4 mt-3"
          onSubmit={submitCompanyInfo}
          name="myForm"
          id="myForm"
        >
          <CompanyInfoJsx
            countrySelect={countrySelect}
            formErrors={formErrors}
            handleCountrySelect={handleCountrySelect}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            // handleSelectCheckbox={handleSelectCheckbox}
            handleStateSelect={handleStateSelect}
            initFormData={initFormData}
            isCountrySelected={isCountrySelected}
            isLoading={isLoading}
            selectErrors={selectErrors}
            setIsCountrySelected={setIsCountrySelected}
            stateSelect={stateSelect}
          />
        </form>
      )}
    </>
  );
};

export default CompanyInfo;
