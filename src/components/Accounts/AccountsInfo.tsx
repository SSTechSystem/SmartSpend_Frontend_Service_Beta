import React, { ChangeEvent, useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import {
  fetchAllCountries,
  fetchAllStates,
  fetchCompanyDropdown,
} from "../../stores/commonList";
import {
  addAccount,
  editAccount,
  fetchSingleAccount,
  getAccountsData,
} from "../../stores/accounts";
import { validateAccountsInfo } from "../../utils/validations";
import { toast } from "react-toastify";
import {
  ErrorState,
  FormState,
  SelectState,
  TextInputState,
} from "../../types/Account/accountsInfoTypes";
import AccountsInfoJsx from "./AccountsInfoJsx";
import CustomLoader from "../Loader/CustomLoader";
import {
  ACCOUNT,
  COMPANY_ADMIN,
  SUCCESS_CODE,
  SUPER_ADMIN,
} from "../../utils/constants";
import secureLocalStorage from "react-secure-storage";

interface StepOneProps {
  nextPage: (page: string) => void;
  setPage: (page: string) => void;
}

const initialState: FormState = {
  name: "",
  description: "",
  building_name: "",
  street_address: "",
  suburb: "",
  state: "",
  country: "",
  pincode: "",
  contact_no: "",
  email: "",
  custom_domain_name: "",
  site_url: "",
  cost_center_name: "",
  port_code: "",
  time_zone: "",
};

const AccountsInfo: React.FC<StepOneProps> = ({ nextPage, setPage }) => {
  const [initFormData, setInitFormData] = useState<FormState>({
    ...initialState,
  });
  const [isCountrySelected, setIsCountrySelected] = useState<boolean>(false);
  const [countrySelect, setCountrySelect] = useState<string>("");
  const [stateSelect, setStateSelect] = useState<string>("");
  const [companySelect, setCompanySelect] = useState<string>("");
  const isAccountsAdded = secureLocalStorage.getItem("newlyAddedAccounts");
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<ErrorState>>({});
  const { account }: any = useAppSelector(getAccountsData);
  const [countryError, setCountryError] = useState<string>("");
  const [stateError, setStateError] = useState<string>("");
  const [companyError, setCompanyError] = useState<string>("");
  const [timezoneError, setTimezoneError] = useState("");
  const role = secureLocalStorage.getItem("role");
  const userData = secureLocalStorage.getItem("user");

  useEffect(() => {
    dispatch(fetchAllCountries());
    if (role === SUPER_ADMIN) {
      dispatch(fetchCompanyDropdown());
    }
  }, []);

  useEffect(() => {
    if ((role === COMPANY_ADMIN || role === ACCOUNT) && userData !== null) {
      const userInfo = JSON.parse(userData as any);
      const companyId = userInfo.company_id;
      if (companyId) {
        setCompanySelect(companyId);
      }
    }
  }, []);

  useEffect(() => {
    setIsFormValid(Object.keys(formErrors).length === 0);
  }, [formErrors]);

  useEffect(() => {
    const removeItemFromLocalStorage = () => {
      secureLocalStorage.removeItem("newlyAddedAccounts");
      secureLocalStorage.removeItem("accountPage");
    };
    if (isAccountsAdded || secureLocalStorage.getItem("accountPage")) {
      window.addEventListener("popstate", removeItemFromLocalStorage);

      return () => {
        window.removeEventListener("popstate", removeItemFromLocalStorage);
      };
    }
  }, [isAccountsAdded]);

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
    const fetchAccountInfo = async () => {
      if (isAccountsAdded) {
        setIsDataLoaded(true);
        await dispatch(fetchSingleAccount(Number(isAccountsAdded)));
        setIsDataLoaded(false);
      }
    };
    fetchAccountInfo();
  }, []);

  useEffect(() => {
    if (account !== null && isAccountsAdded) {
      setIsCountrySelected(true);
      setInitFormData((prev) => ({
        ...prev,
        name: account.name || "",
        description: account.description || "",
        building_name: account.building_name || "",
        street_address: account.street_address || "",
        suburb: account.suburb || "",
        pincode: account.pincode || "",
        contact_no: account.contact_no || "",
        email: account.email || "",
        custom_domain_name: account.custom_domain_name || "",
        site_url: account.site_url || "",
        cost_center_name: account.cost_center_name || "",
        port_code: account.port_code || "",
        time_zone: account.time_zone || "",
      }));
      setCountrySelect(account.country);
      setStateSelect(account.state);
      setCompanySelect(account.company_id);
    }
  }, [account, isAccountsAdded]);

  const handleCountrySelect = (selectedValue: string) => {
    setCountrySelect(selectedValue);
    setStateSelect("");

    if (selectedValue === undefined || selectedValue === "") {
      setStateSelect("");
      setInitFormData((prev) => ({ ...prev, suburb: "" }));
      setCountryError("Country is required");
    } else {
      setCountryError("");
    }
  };

  const handleStateSelect = (selectedValue: string) => {
    setStateSelect(selectedValue);
    if (selectedValue === undefined || selectedValue === "") {
      setStateError("State is required");
    } else {
      setStateError("");
    }
  };

  const handleCompanySelect = (selectedValue: string) => {
    setCompanySelect(selectedValue);
    if (selectedValue === undefined || selectedValue === "") {
      setCompanyError("Please select a company");
    } else {
      setCompanyError("");
    }
  };

  const handleSelect = (selectedVal: string, fieldName: keyof SelectState) => {
    setInitFormData((prev) => ({
      ...prev,
      [fieldName]: selectedVal,
    }));
    if (fieldName === "time_zone") {
      setTimezoneError(selectedVal ? "" : "Timezone is required");
    }
  };

  const handleChange = (key: string, value: string) => {
    const formData = new FormData(
      document.getElementById("accountsInfo") as HTMLFormElement
    );
    formData.set(key, value);
    let errors = validateAccountsInfo(formData);
    setFormErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0);
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    fieldName: keyof TextInputState
  ) => {
    const { value } = event.target;
    setInitFormData((prevState) => ({ ...prevState, [fieldName]: value }));
    handleChange(fieldName, value);
  };

  const submitAccountsInfo = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const errors = validateAccountsInfo(formData);
    setFormErrors(errors);
    if (!countrySelect) {
      setCountryError("Country is required");
    }
    if (!stateSelect) {
      setStateError("State is required");
    }
    if (role === SUPER_ADMIN && !companySelect) {
      setCompanyError("Please select a company");
    }
    if (!initFormData.time_zone) {
      setTimezoneError("Timezone is required");
    }
    if (
      !stateSelect ||
      !countrySelect ||
      (role === SUPER_ADMIN && !companySelect) ||
      !initFormData.time_zone
    ) {
      return;
    }
    if (Object.keys(errors).length === 0) {
      const payload = {
        ...initFormData,
        country: countrySelect,
        state: stateSelect,
        company_id: companySelect,
      };
      if (isAccountsAdded) {
        try {
          setIsLoading(true);
          const res = await dispatch(
            editAccount({
              ...payload,
              id: isAccountsAdded,
              email: initFormData.email.toLocaleLowerCase(),
            })
          );
          if (res.payload?.status === SUCCESS_CODE) {
            toast.success(
              res.payload.data?.message || "Account updated successfully"
            );
            setPage("2");
          } else {
            return toast.error(
              res.payload.response?.data?.message || "Something went wrong"
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
            addAccount({
              ...payload,
              email: initFormData.email.toLocaleLowerCase(),
            })
          );
          if (res.payload?.status === SUCCESS_CODE) {
            secureLocalStorage.setItem(
              "newlyAddedAccounts",
              res.payload.data.data?.last_insert_id
            );
            toast.success(
              res.payload.data?.message || "Account created successfully"
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
        <CustomLoader />
      ) : (
        <form
          className="grid grid-cols-12 gap-4 mt-3"
          onSubmit={submitAccountsInfo}
          name="accountsInfo"
          id="accountsInfo"
        >
          <AccountsInfoJsx
            companyError={companyError}
            companySelect={companySelect}
            countryError={countryError}
            countrySelect={countrySelect}
            formErrors={formErrors}
            handleCompanySelect={handleCompanySelect}
            handleCountrySelect={handleCountrySelect}
            handleInputChange={handleInputChange}
            handleStateSelect={handleStateSelect}
            initFormData={initFormData}
            isCountrySelected={isCountrySelected}
            isLoading={isLoading}
            setIsCountrySelected={setIsCountrySelected}
            stateError={stateError}
            stateSelect={stateSelect}
            handleSelect={handleSelect}
            timezoneError={timezoneError}
          />
        </form>
      )}
    </>
  );
};

export default AccountsInfo;
