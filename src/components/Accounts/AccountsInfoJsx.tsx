import React, { ChangeEvent } from "react";
import { FormInput, FormLabel, FormTextarea } from "../../base-components/Form";
import { Controller, useForm } from "react-hook-form";
import { Autocomplete, TextField } from "@mui/material";
import clsx from "clsx";
import { useAppSelector } from "../../stores/hooks";
import { selectDarkMode } from "../../stores/darkModeSlice";
import {
  getCompanyDropdownData,
  getCountriesData,
  getStatesData,
} from "../../stores/commonList";
import Button from "../../base-components/Button";
import LoadingIcon from "../../base-components/LoadingIcon";
import { AccountsInfoProps } from "../../types/Account/accountsInfoTypes";
import timeZoneData from "../../utils/timezoneData";
import { getAccountsData } from "../../stores/accounts";
import { SUPER_ADMIN } from "../../utils/constants";
import secureLocalStorage from "react-secure-storage";

type ListOptions = {
  name: string;
  id: number;
};

const AccountsInfoJsx: React.FC<AccountsInfoProps> = ({
  initFormData,
  companyError,
  countryError,
  companySelect,
  handleCompanySelect,
  countrySelect,
  handleCountrySelect,
  setIsCountrySelected,
  handleInputChange,
  formErrors,
  stateSelect,
  isCountrySelected,
  handleStateSelect,
  stateError,
  isLoading,
  handleSelect,
  timezoneError,
}) => {
  const companyDropdownOptions: any = useAppSelector(getCompanyDropdownData);
  const countryOptions: any = useAppSelector(getCountriesData);
  const stateOptions: any = useAppSelector(getStatesData);
  const darkMode = useAppSelector(selectDarkMode);
  const isAccountsAdded = secureLocalStorage.getItem("newlyAddedAccounts");
  const { account }: any = useAppSelector(getAccountsData);
  const role = secureLocalStorage.getItem("role");

  const { control } = useForm({
    mode: "onChange",
    defaultValues: initFormData,
  });

  return (
    <>
      {isAccountsAdded && role === SUPER_ADMIN ? (
        <div className="col-span-12 sm:col-span-6 md:col-span-4 intro-y">
          <span>Company Name</span>
          <section className="font-bold uppercase mt-3">
            {account?.company_name ? account.company_name : "N/A"}
          </section>
        </div>
      ) : (
        <>
          {role === SUPER_ADMIN && (
            <div className="col-span-12 intro-y sm:col-span-6 md:col-span-4">
              <FormLabel htmlFor="input-wizard-111">
                Select Company <span className="text-red-600 font-bold">*</span>
              </FormLabel>
              <Controller
                name="companySelectName"
                control={control}
                render={({ field: { value } }) => {
                  const selectedState: any = companyDropdownOptions?.find(
                    (option: ListOptions) => option.id === Number(value)
                  );
                  const selectedCompany = companyDropdownOptions?.find(
                    (option: ListOptions) => option.id === Number(companySelect)
                  );
                  const defaultValue =
                    (selectedState === undefined
                      ? selectedCompany
                      : selectedState) || null;
                  return (
                    <>
                      <Autocomplete
                        disablePortal
                        size="small"
                        componentsProps={{
                          popper: {
                            modifiers: [
                              {
                                name: "flip",
                                enabled: false,
                              },
                            ],
                          },
                        }}
                        id="input-wizard-111"
                        value={defaultValue}
                        options={companyDropdownOptions?.map(
                          (data: ListOptions) => ({
                            value: data.id,
                            label: data.name,
                          })
                        )}
                        getOptionLabel={(option) => option.label ?? option.name}
                        onChange={(_, newVal) => {
                          handleCompanySelect(newVal?.value);
                        }}
                        isOptionEqualToValue={(option, value) =>
                          option.value === (value.id ? value.id : null)
                        }
                        disabled={isAccountsAdded ? true : false}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Company"
                            className={clsx(
                              "transition duration-200 custom-select ease-in-out w-full text-sm border-slate-200 shadow-sm rounded-md placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary focus:border-opacity-40 dark:bg-darkmode-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:placeholder:text-slate-500/80"
                            )}
                            InputLabelProps={{
                              style: {
                                fontSize: 12,
                                color: `${darkMode ? "inherit" : ""}`,
                                paddingTop: 3,
                              },
                            }}
                          />
                        )}
                      />
                      {companyError && (
                        <div className="mt-2 text-xs sm:text-sm text-danger dark:text-red-500">
                          {typeof companyError === "string" && companyError}
                        </div>
                      )}
                    </>
                  );
                }}
              />
            </div>
          )}
        </>
      )}
      <div className="col-span-12 intro-y sm:col-span-6 md:col-span-4">
        <FormLabel htmlFor="input-wizard-7">
          Country <span className="text-red-600 font-bold">*</span>
        </FormLabel>
        <Controller
          name="country"
          control={control}
          render={({ field: { value } }) => {
            const selectedState: any = countryOptions.find(
              (option: ListOptions) => option.id === Number(value)
            );
            const selectedCountry = countryOptions?.find(
              (option: ListOptions) => option.id === Number(countrySelect)
            );
            const defaultValue =
              (selectedState === undefined ? selectedCountry : selectedState) ||
              null;
            return (
              <>
                <Autocomplete
                  disablePortal
                  className={clsx({
                    "border-danger": countryError,
                  })}
                  size="small"
                  id="input-wizard-7"
                  componentsProps={{
                    popper: {
                      modifiers: [
                        {
                          name: "flip",
                          enabled: false,
                        },
                      ],
                    },
                  }}
                  value={defaultValue}
                  options={countryOptions?.map((data: ListOptions) => ({
                    value: data.id,
                    label: data.name,
                  }))}
                  getOptionLabel={(option) => option.label ?? option.name}
                  onChange={(_, newVal) => {
                    handleCountrySelect(newVal?.value);
                    if (newVal?.value && newVal?.value !== "") {
                      setIsCountrySelected(true);
                    } else {
                      setIsCountrySelected(false);
                    }
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option.value === (value.id ? value.id : null)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Country"
                      className={clsx(
                        "disabled:bg-slate-100 custom-select dark:!border-blac disabled:cursor-not-allowed dark:disabled:bg-darkmode-800/50 dark:disabled:border-transparent",
                        "[&[readonly]]:bg-slate-100 [&[readonly]]:cursor-not-allowed [&[readonly]]:dark:bg-darkmode-800/50 [&[readonly]]:dark:border-transparent",
                        "transition duration-200 ease-in-out w-full text-sm border-slate-200 shadow-sm rounded-md placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary focus:border-opacity-40 dark:bg-darkmode-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:placeholder:text-slate-500/80"
                      )}
                      InputLabelProps={{
                        style: {
                          fontSize: 12,
                          color: `${darkMode ? "inherit" : ""}`,
                          paddingTop: 3,
                        },
                      }}
                    />
                  )}
                />
                {countryError && (
                  <div className="mt-2 text-xs sm:text-sm text-danger dark:text-red-500">
                    {typeof countryError === "string" && countryError}
                  </div>
                )}
              </>
            );
          }}
        />
      </div>
      <div className="col-span-12 intro-y sm:col-span-6 md:col-span-4">
        <FormLabel htmlFor="input-wizard-1">
          Name <span className="text-red-600 font-bold">*</span>
        </FormLabel>
        <FormInput
          id="input-wizard-1"
          type="text"
          name="name"
          className={clsx({
            "border-danger dark:!border-red-500": formErrors.name,
          })}
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, "name")
          }
          autoComplete="name"
          aria-autocomplete="inline"
          maxLength={50}
          placeholder="Enter Name"
          value={initFormData.name ? initFormData.name : ""}
        />
        {formErrors.name && (
          <div className="mt-2 text-xs sm:text-sm text-danger dark:text-red-500">
            {typeof formErrors.name === "string" && formErrors.name}
          </div>
        )}
      </div>
      <div className="col-span-12 intro-y sm:col-span-6 md:col-span-4">
        <FormLabel htmlFor="input-wizard-2">Accounts Description</FormLabel>
        <FormTextarea
          id="input-wizard-2"
          name="description"
          onInput={(e: ChangeEvent<HTMLTextAreaElement>) =>
            handleInputChange(e, "description")
          }
          className="h-[38px]"
          placeholder="Enter Accounts Description"
          value={initFormData.description}
          maxLength={150}
        />
      </div>
      <div className="col-span-12 intro-y sm:col-span-6 md:col-span-4">
        <FormLabel htmlFor="input-wizard-3">
          Building Name / Address 1{" "}
          <span className="text-red-600 font-bold">*</span>
        </FormLabel>
        <FormInput
          id="input-wizard-3"
          type="text"
          name="building_name"
          className={clsx({
            "border-danger dark:!border-red-500": formErrors.building_name,
          })}
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, "building_name")
          }
          maxLength={50}
          placeholder="Building Name"
          value={initFormData.building_name ? initFormData.building_name : ""}
        />
        {formErrors.building_name && (
          <div className="mt-2 text-xs sm:text-sm text-danger dark:text-red-500">
            {typeof formErrors.building_name === "string" &&
              formErrors.building_name}
          </div>
        )}
      </div>
      <div className="col-span-12 intro-y sm:col-span-6 md:col-span-4">
        <FormLabel htmlFor="input-wizard-4">
          Street Address / Address 2
        </FormLabel>
        <FormInput
          id="input-wizard-4"
          type="text"
          name="street_address"
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, "street_address")
          }
          className={`${
            formErrors.street_address && "border-danger dark:!border-red-500"
          }`}
          maxLength={50}
          autoComplete="street_address"
          aria-autocomplete="inline"
          placeholder="Street Address"
          value={initFormData.street_address ? initFormData.street_address : ""}
        />
        {formErrors && formErrors.street_address && (
          <div className="mt-2 text-danger dark:text-red-500">
            {formErrors.street_address}
          </div>
        )}
      </div>
      <div
        className={`col-span-12 intro-y sm:col-span-6 ${
          role === SUPER_ADMIN ? "md:col-span-3" : "md:col-span-4"
        }`}
      >
        <FormLabel htmlFor="input-wizard-5">
          Suburb / City <span className="text-red-600 font-bold">*</span>
        </FormLabel>
        <FormInput
          id="input-wizard-5"
          type="text"
          placeholder="Enter City"
          name="suburb"
          className={clsx({
            "border-danger dark:!border-red-500": formErrors.suburb,
          })}
          minLength={3}
          maxLength={50}
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, "suburb")
          }
          disabled={countrySelect === undefined || countrySelect === ""}
          value={
            countrySelect === undefined || countrySelect === ""
              ? ""
              : initFormData.suburb
          }
        />
        {formErrors.suburb && (
          <div className="mt-2 text-xs sm:text-sm text-danger dark:text-red-500">
            {typeof formErrors.suburb === "string" && formErrors.suburb}
          </div>
        )}
      </div>
      <div
        className={`col-span-12 intro-y sm:col-span-6 ${
          role === SUPER_ADMIN ? "md:col-span-3" : "md:col-span-4"
        }`}
      >
        <FormLabel htmlFor="input-wizard-8">
          State <span className="text-red-600 font-bold">*</span>
        </FormLabel>
        <Controller
          name="state"
          control={control}
          render={({ field: { value } }) => {
            const selectedState: any = stateOptions.find(
              (option: ListOptions) => option.id === Number(value)
            );
            const selectedOneState = stateOptions?.find(
              (option: ListOptions) => option.id === Number(stateSelect)
            );
            const defaultValue = !isCountrySelected
              ? null
              : (selectedState === undefined
                  ? selectedOneState
                  : selectedState) || null;
            return (
              <>
                <Autocomplete
                  size="small"
                  id="combo-box-demo"
                  value={!isCountrySelected ? null : defaultValue}
                  options={stateOptions?.map((data: ListOptions) => ({
                    value: data.id,
                    label: data.name,
                  }))}
                  getOptionLabel={(option) => option.label ?? option.name}
                  onChange={(_, newVal) => {
                    handleStateSelect(newVal?.value);
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option.value === (value.id ? value.id : null)
                  }
                  disabled={!isCountrySelected}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="State"
                      className={clsx(
                        "transition duration-200 custom-select ease-in-out w-full text-sm border-slate-200 shadow-sm rounded-md placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary focus:border-opacity-40 dark:bg-darkmode-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:placeholder:text-slate-500/80"
                      )}
                      InputLabelProps={{
                        style: {
                          fontSize: 12,
                          color: `${darkMode ? "inherit" : ""}`,
                          paddingTop: 3,
                        },
                      }}
                    />
                  )}
                />
                {stateError && (
                  <div className="mt-2 text-xs sm:text-sm text-danger dark:text-red-500">
                    {typeof stateError === "string" && stateError}
                  </div>
                )}
              </>
            );
          }}
        />
      </div>
      <div
        className={`col-span-12 intro-y sm:col-span-6 ${
          role === SUPER_ADMIN ? "md:col-span-3" : "md:col-span-4"
        }`}
      >
        <FormLabel htmlFor="input-wizard-8">
          Pincode <span className="text-red-600 font-bold">*</span>
        </FormLabel>
        <FormInput
          id="input-wizard-8"
          type="text"
          name="pincode"
          className={clsx({
            "border-danger dark:!border-red-500": formErrors.pincode,
          })}
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, "pincode")
          }
          minLength={3}
          maxLength={10}
          placeholder="Enter Pincode"
          value={initFormData.pincode}
        />
        {formErrors.pincode && (
          <div className="mt-2 text-xs sm:text-sm text-danger dark:text-red-500">
            {typeof formErrors.pincode === "string" && formErrors.pincode}
          </div>
        )}
      </div>
      <div
        className={`col-span-12 intro-y sm:col-span-6 ${
          role === SUPER_ADMIN ? "md:col-span-3" : "md:col-span-4"
        }`}
      >
        <FormLabel htmlFor="input-wizard-16">
          Timezone <span className="text-red-600 font-bold">*</span>
        </FormLabel>
        <Controller
          name="time_zone"
          control={control}
          render={() => {
            const selectedTimeZone = timeZoneData?.find(
              (option: string) => option === initFormData.time_zone
            );
            const defaultValue = selectedTimeZone || null;
            return (
              <>
                <Autocomplete
                  size="small"
                  id="input-wizard-16"
                  value={defaultValue as any}
                  options={timeZoneData?.map((data: string) => ({
                    value: data,
                    label: data,
                  }))}
                  getOptionLabel={(option) => option.label ?? option}
                  onChange={(_, newVal) => {
                    handleSelect(newVal?.value, "time_zone");
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option.value === (value ? value : null)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Timezone"
                      className={clsx(
                        "transition duration-200 custom-select ease-in-out w-full text-sm border-slate-200 shadow-sm rounded-md placeholder:text-slate-400/90 focus:ring-4 focus:ring-primary focus:ring-opacity-20 focus:border-primary focus:border-opacity-40 dark:bg-darkmode-800 dark:border-transparent dark:focus:ring-slate-700 dark:focus:ring-opacity-50 dark:placeholder:text-slate-500/80"
                      )}
                      InputLabelProps={{
                        style: {
                          fontSize: 12,
                          color: `${darkMode ? "inherit" : ""}`,
                          paddingTop: 3,
                        },
                      }}
                    />
                  )}
                />
                {timezoneError && (
                  <div className="mt-2 text-xs sm:text-sm text-danger dark:text-red-500">
                    {typeof timezoneError === "string" && timezoneError}
                  </div>
                )}
              </>
            );
          }}
        />
      </div>
      <div className="col-span-12 intro-y sm:col-span-6 md:col-span-4">
        <FormLabel htmlFor="input-wizard-10">
          Contact No <span className="text-red-600 font-bold">*</span>
        </FormLabel>
        <FormInput
          id="input-wizard-10"
          type="text"
          name="contact_no"
          className={clsx({
            "border-danger dark:!border-red-500": formErrors.contact_no,
          })}
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, "contact_no")
          }
          minLength={7}
          maxLength={20}
          placeholder="Enter Contact No."
          value={initFormData.contact_no}
        />
        {formErrors.contact_no && (
          <div className="mt-2 text-xs sm:text-sm text-danger dark:text-red-500">
            {typeof formErrors.contact_no === "string" && formErrors.contact_no}
          </div>
        )}
      </div>
      <div className="col-span-12 intro-y sm:col-span-6 md:col-span-4">
        <FormLabel htmlFor="input-wizard-11">
          Email Address <span className="text-red-600 font-bold">*</span>
        </FormLabel>
        <FormInput
          id="input-wizard-11"
          type="email"
          name="email"
          className={clsx({
            "border-danger dark:!border-red-500": formErrors.email,
          })}
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, "email")
          }
          autoComplete="email"
          aria-autocomplete="inline"
          maxLength={50}
          placeholder="Enter Email Address"
          value={initFormData.email}
        />
        {formErrors.email && (
          <div className="mt-2 text-xs sm:text-sm text-danger dark:text-red-500">
            {typeof formErrors.email === "string" && formErrors.email}
          </div>
        )}
      </div>
      <div className="col-span-12 intro-y sm:col-span-6 md:col-span-4">
        <FormLabel htmlFor="input-wizard-12">Custom Domain Name</FormLabel>
        <FormInput
          id="input-wizard-12"
          type="text"
          name="custom_domain_name"
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, "custom_domain_name")
          }
          maxLength={50}
          placeholder="Enter Custom Domain Name."
          value={initFormData.custom_domain_name}
        />
      </div>
      <div className="col-span-12 intro-y sm:col-span-6 md:col-span-4">
        <FormLabel htmlFor="input-wizard-15">Port Code</FormLabel>
        <FormInput
          id="input-wizard-15"
          type="text"
          name="port_code"
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, "port_code")
          }
          maxLength={5}
          placeholder="Enter Port Code"
          value={initFormData.port_code}
        />
      </div>
      <div className="col-span-12 intro-y sm:col-span-6 md:col-span-4">
        <FormLabel htmlFor="input-wizard-13">Site URL</FormLabel>
        <FormInput
          id="input-wizard-13"
          type="text"
          name="site_url"
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, "site_url")
          }
          className={`${
            formErrors.site_url && "border-danger dark:!border-red-500"
          }`}
          maxLength={50}
          placeholder="Enter Site URL"
          value={initFormData.site_url}
        />
        {formErrors && formErrors.site_url && (
          <div className="mt-2 text-xs sm:text-sm text-danger dark:text-red-500">
            {formErrors.site_url}
          </div>
        )}
      </div>
      <div className="col-span-12 intro-y sm:col-span-6 md:col-span-4">
        <FormLabel htmlFor="input-wizard-14">Cost Center Name</FormLabel>
        <FormInput
          id="input-wizard-14"
          type="text"
          name="cost_center_name"
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, "cost_center_name")
          }
          placeholder="Enter Cost Center Name"
          maxLength={50}
          value={initFormData.cost_center_name}
        />
      </div>
      <div className="flex justify-center items-center col-span-12 mt-3 intro-y sm:justify-end">
        <Button
          variant="primary"
          className="w-24 ml-2 text-xs"
          type="submit"
          disabled={
            countryError ||
            stateError ||
            companyError ||
            timezoneError ||
            isLoading ||
            Object.values(formErrors).length !== 0
              ? true
              : false
          }
        >
          {isLoading ? (
            <>
              Next
              <LoadingIcon icon="oval" color="white" className="w-4 h-4 ml-2" />
            </>
          ) : (
            "Next"
          )}
        </Button>
      </div>
    </>
  );
};

export default AccountsInfoJsx;
