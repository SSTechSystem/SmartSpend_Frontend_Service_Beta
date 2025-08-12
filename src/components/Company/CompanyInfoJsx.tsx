import React, { ChangeEvent } from "react";
import {
  FormCheck,
  FormInput,
  FormLabel,
  FormTextarea,
} from "../../base-components/Form";
import clsx from "clsx";
import { Controller, useForm } from "react-hook-form";
import { Autocomplete, TextField } from "@mui/material";
import Button from "../../base-components/Button";
import LoadingIcon from "../../base-components/LoadingIcon";
import timeZoneData from "../../utils/timezoneData";
import { useAppSelector } from "../../stores/hooks";
import { selectDarkMode } from "../../stores/darkModeSlice";
import {
  getCountriesData,
  getCurrenciesData,
  getStatesData,
} from "../../stores/commonList";
import {
  CompanyInfoProps,
  CurrencyOptions,
  ListOptions,
} from "../../types/Company/companyInfoTypes";
import { getCompaniesData } from "../../stores/company";
import secureLocalStorage from "react-secure-storage";

const industryTypeOptions = [
  { label: "Logistics", value: "logistics" },
  { label: "Medical", value: "medical" },
];

const CompanyInfoJsx: React.FC<CompanyInfoProps> = ({
  initFormData,
  // handleSelectCheckbox,
  formErrors,
  handleInputChange,
  countrySelect,
  selectErrors,
  handleCountrySelect,
  setIsCountrySelected,
  stateSelect,
  isCountrySelected,
  handleStateSelect,
  handleSelectChange,
  isLoading,
}) => {
  const darkMode = useAppSelector(selectDarkMode);
  const countryOptions: any = useAppSelector(getCountriesData);
  const stateOptions: any = useAppSelector(getStatesData);
  const currencyOptions: any = useAppSelector(getCurrenciesData);
  const { companyCode }: any = useAppSelector(getCompaniesData);
  const isCompanyAdded = secureLocalStorage.getItem("newlyAddedCompany");

  const { control } = useForm({
    mode: "onChange",
    defaultValues: initFormData,
  });

  return (
    <>
      {/* <div className="col-span-12 sm:col-span-4 lg:col-span-2">
        <FormCheck.Input
          className="border-slate-400"
          type="checkbox"
          id="is_root_company"
          checked={initFormData.is_root_company}
          onChange={handleSelectCheckbox}
        />
        <FormLabel htmlFor="is_root_company" className="ml-3 cursor-pointer">
          Mark As a Root
        </FormLabel>
      </div> */}
      <div className="col-span-12 intro-y flex gap-5">
        <FormLabel htmlFor="input-wizard-1" className="flex justify-between">
          <span>Company Code : </span>
        </FormLabel>
        <section className="font-bold uppercase">
          {isCompanyAdded ? initFormData.company_code : companyCode}
        </section>
      </div>
      <div className="col-span-12 intro-y sm:col-span-6 md:col-span-3">
        <FormLabel htmlFor="input-wizard-1">
          Company Name <span className="text-red-600 font-bold">*</span>
        </FormLabel>
        <FormInput
          id="input-wizard-1"
          type="text"
          name="name"
          autoComplete="name"
          aria-autocomplete="inline"
          className={clsx({
            "border-danger dark:!border-red-500": formErrors.name,
          })}
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, "name")
          }
          maxLength={50}
          minLength={3}
          placeholder="Enter Company Name"
          value={initFormData.name ? initFormData.name : ""}
        />
        {formErrors.name && (
          <div className="mt-2 text-xs sm:text-sm text-danger dark:text-red-500">
            {typeof formErrors.name === "string" && formErrors.name}
          </div>
        )}
      </div>
      <div className="col-span-12 intro-y sm:col-span-6 md:col-span-3">
        <FormLabel htmlFor="input-wizard-2">Company Description</FormLabel>
        <FormTextarea
          id="input-wizard-2"
          name="description"
          onInput={(e: ChangeEvent<HTMLTextAreaElement>) =>
            handleInputChange(e, "description")
          }
          className="h-[38px]"
          placeholder="Enter Company Description"
          value={initFormData.description}
          maxLength={150}
        />
      </div>
      <div className="col-span-12 intro-y sm:col-span-6 md:col-span-2">
        <FormLabel htmlFor="input-wizard-77">
          Country <span className="text-red-600 font-bold">*</span>
        </FormLabel>
        <Controller
          name="country"
          control={control}
          render={({ field: { value } }) => {
            const selectedState: any = countryOptions?.find(
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
                    "!border-danger dark:!border-red-500": selectErrors.country,
                  })}
                  title={defaultValue ? defaultValue.name : ""}
                  size="small"
                  id="input-wizard-77"
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
                {selectErrors.country && (
                  <div className="mt-2 text-xs sm:text-sm text-danger dark:text-red-500">
                    {typeof selectErrors.country === "string" &&
                      selectErrors.country}
                  </div>
                )}
              </>
            );
          }}
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
          minLength={3}
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
          autoComplete="street_address"
          aria-autocomplete="inline"
          className={`${
            formErrors.street_address && "border-danger dark:!border-red-500"
          }`}
          maxLength={50}
          placeholder="Street Address"
          value={initFormData.street_address ? initFormData.street_address : ""}
        />
        {formErrors && formErrors.street_address && (
          <div className="mt-2 text-xs sm:text-sm text-danger dark:text-red-500">
            {formErrors.street_address}
          </div>
        )}
      </div>
      <div className="col-span-12 intro-y sm:col-span-6 md:col-span-3">
        <FormLabel htmlFor="input-wizard-5">
          Suburb / City <span className="text-red-600 font-bold">*</span>
        </FormLabel>
        <FormInput
          id="input-wizard-5"
          type="text"
          placeholder="Enter City"
          name="city"
          className={clsx({
            "border-danger dark:!border-red-500": formErrors.city,
          })}
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, "city")
          }
          minLength={3}
          maxLength={50}
          disabled={countrySelect === undefined || countrySelect === ""}
          value={
            countrySelect === undefined || countrySelect === ""
              ? ""
              : initFormData.city
          }
        />
        {formErrors.city && (
          <div className="mt-2 text-xs sm:text-sm text-danger dark:text-red-500">
            {typeof formErrors.city === "string" && formErrors.city}
          </div>
        )}
      </div>
      <div className="col-span-12 intro-y sm:col-span-6 md:col-span-3">
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
                  className={clsx({
                    "border-danger dark:!border-red-500": selectErrors.state,
                  })}
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
                {selectErrors.state && (
                  <div className="mt-2 text-xs sm:text-sm text-danger dark:text-red-500">
                    {typeof selectErrors.state === "string" &&
                      selectErrors.state}
                  </div>
                )}
              </>
            );
          }}
        />
      </div>
      <div className="col-span-12 intro-y sm:col-span-6 md:col-span-2">
        <FormLabel htmlFor="input-wizard-8">
          Zipcode <span className="text-red-600 font-bold">*</span>
        </FormLabel>
        <FormInput
          id="input-wizard-8"
          type="text"
          name="zipcode"
          className={clsx({
            "border-danger dark:!border-red-500": formErrors.zipcode,
          })}
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, "zipcode")
          }
          minLength={3}
          maxLength={10}
          placeholder="Enter Zipcode"
          value={initFormData.zipcode ? initFormData.zipcode : ""}
        />
        {formErrors.zipcode && (
          <div className="mt-2 text-xs sm:text-sm text-danger dark:text-red-500">
            {typeof formErrors.zipcode === "string" && formErrors.zipcode}
          </div>
        )}
      </div>
      <div className="col-span-12 intro-y sm:col-span-6 md:col-span-3">
        <FormLabel htmlFor="input-wizard-9">
          Contact No <span className="text-red-600 font-bold">*</span>
        </FormLabel>
        <FormInput
          id="input-wizard-9"
          type="text"
          name="help_line_number"
          className={clsx({
            "border-danger dark:!border-red-500": formErrors.help_line_number,
          })}
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, "help_line_number")
          }
          minLength={7}
          maxLength={20}
          placeholder="Enter Contact No."
          value={initFormData.help_line_number}
        />
        {formErrors.help_line_number && (
          <div className="mt-2 text-xs sm:text-sm text-danger dark:text-red-500">
            {typeof formErrors.help_line_number === "string" &&
              formErrors.help_line_number}
          </div>
        )}
      </div>
      <div className="col-span-12 intro-y sm:col-span-6 md:col-span-4">
        <FormLabel htmlFor="input-wizard-10">
          Email Address <span className="text-red-600 font-bold">*</span>
        </FormLabel>
        <FormInput
          id="input-wizard-10"
          type="email"
          name="email"
          autoComplete="email"
          aria-autocomplete="inline"
          className={clsx({
            "border-danger dark:!border-red-500": formErrors.email,
          })}
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, "email")
          }
          maxLength={50}
          placeholder="Enter Email Address"
          value={initFormData.email ? initFormData.email : ""}
        />
        {formErrors.email && (
          <div className="mt-2 text-xs sm:text-sm text-danger dark:text-red-500">
            {typeof formErrors.email === "string" && formErrors.email}
          </div>
        )}
      </div>
      <div className="col-span-12 intro-y sm:col-span-6 md:col-span-3">
        <FormLabel htmlFor="input-wizard-11">
          Timezone <span className="text-red-600 font-bold">*</span>
        </FormLabel>
        <Controller
          name="time_zone"
          control={control}
          render={({ field: { onChange, value } }) => {
            const selectedState: any = timeZoneData.find(
              (option: string) => option === value
            );
            const selectedTimeZone = timeZoneData?.find(
              (option: string) => option === initFormData.time_zone
            );
            const defaultValue =
              (selectedState === undefined
                ? selectedTimeZone
                : selectedState) || null;
            return (
              <>
                <Autocomplete
                  size="small"
                  className={clsx({
                    "border-danger dark:!border-red-500":
                      selectErrors.time_zone,
                  })}
                  id="input-wizard-11"
                  value={defaultValue}
                  options={timeZoneData?.map((data: string) => ({
                    value: data,
                    label: data,
                  }))}
                  getOptionLabel={(option) => option.label ?? option}
                  onChange={(_, newVal) => {
                    onChange(newVal?.value || "");
                    handleSelectChange(newVal?.value || "", "time_zone");
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
                {selectErrors.time_zone && (
                  <div className="mt-2 text-xs sm:text-sm text-danger dark:text-red-500">
                    {typeof selectErrors.time_zone === "string" &&
                      selectErrors.time_zone}
                  </div>
                )}
              </>
            );
          }}
        />
      </div>
      {isCompanyAdded ? (
        <div className="col-span-12 sm:col-span-6 md:col-span-2 intro-y">
          <FormLabel htmlFor="input-wizard-1" className="flex justify-between">
            <span>Prefix</span>
          </FormLabel>
          <section className="font-bold uppercase mt-3">
            {initFormData.company_prefix}
          </section>
        </div>
      ) : (
        <div className="col-span-12 sm:col-span-6 intro-y md:col-span-2">
          <FormLabel htmlFor="input-wizard-99">
            Prefix <span className="text-red-600 font-bold">*</span>
          </FormLabel>
          <FormInput
            id="input-wizard-99"
            type="text"
            name="company_prefix"
            onInput={(e: ChangeEvent<HTMLInputElement>) =>
              handleInputChange(e, "company_prefix")
            }
            disabled={isCompanyAdded ? true : false}
            className={clsx({
              "border-danger dark:!border-red-500": formErrors.company_prefix,
            })}
            placeholder="Enter Prefix"
            value={initFormData.company_prefix}
            maxLength={3}
          />
          {formErrors.company_prefix && (
            <div className="mt-2 text-xs sm:text-sm text-danger dark:text-red-500">
              {typeof formErrors.company_prefix === "string" &&
                formErrors.company_prefix}
            </div>
          )}
        </div>
      )}

      <div className="col-span-12 intro-y sm:col-span-6 md:col-span-3">
        <FormLabel htmlFor="input-wizard-12">
          Currency <span className="text-red-600 font-bold">*</span>
        </FormLabel>
        <Controller
          name="company_currency"
          control={control}
          render={({ field: { onChange, value } }) => {
            const selectedState: any = currencyOptions?.find(
              (option: CurrencyOptions) => option.currency_code === value
            );
            const selectedCurrency = currencyOptions?.find(
              (option: CurrencyOptions) =>
                option.currency_code === initFormData.company_currency
            );
            const defaultValue =
              (selectedState === undefined
                ? selectedCurrency
                : selectedState) || null;
            return (
              <>
                <Autocomplete
                  size="small"
                  id="input-wizard-12"
                  className={clsx({
                    "border-danger dark:!border-red-500":
                      selectErrors.company_currency,
                  })}
                  value={defaultValue}
                  options={currencyOptions?.map((data: CurrencyOptions) => ({
                    value: data.currency_code,
                    label: data.currency_code,
                  }))}
                  getOptionLabel={(option) =>
                    option.label ?? option.currency_code
                  }
                  onChange={(_, newVal) => {
                    onChange(newVal?.value || "");
                    handleSelectChange(newVal?.value || "", "company_currency");
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option.value ===
                    (value.currency_code ? value.currency_code : null)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Currency"
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
                {selectErrors.company_currency && (
                  <div className="mt-2 text-xs sm:text-sm text-danger dark:text-red-500">
                    {typeof selectErrors.company_currency === "string" &&
                      selectErrors.company_currency}
                  </div>
                )}
              </>
            );
          }}
        />
      </div>
      <div
        className={`col-span-12 sm:col-span-6 self-center md:col-span-4 intro-y ${
          selectErrors.company_currency ? "sm:mt-1" : "sm:mt-8"
        }`}
      >
        <FormCheck.Input
          className="border-slate-400"
          type="checkbox"
          id="is_parcel_scan_require"
          checked={initFormData.is_parcel_scan_require}
          onChange={(e) => handleInputChange(e, "is_parcel_scan_require")}
        />
        <FormLabel
          htmlFor="is_parcel_scan_require"
          className="ml-3 cursor-pointer"
        >
          Is Parcel Scan Required?
        </FormLabel>
      </div>
      <div className="col-span-12 intro-y sm:col-span-6 md:col-span-4">
        <div className="flex justify-between">
          <FormLabel htmlFor="input-wizard-7">Industry Type</FormLabel>
        </div>
        <Controller
          name="industry_type"
          control={control}
          render={({ field: { onChange } }) => {
            const selectedIndustryType = industryTypeOptions?.find(
              (option) => option.value === initFormData.industry_type
            );

            const defaultValue = selectedIndustryType || null;

            return (
              <>
                <Autocomplete
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
                  id="input-wizard-7"
                  value={defaultValue}
                  options={industryTypeOptions?.map((data) => ({
                    value: data.value,
                    label: data.label,
                  }))}
                  getOptionLabel={(option) => option.label}
                  onChange={(_, newVal) => {
                    onChange(newVal?.value || "");
                    handleSelectChange(newVal?.value || "", "industry_type");
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option.value === (value.value ? value.value : null)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Industry Type"
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
              </>
            );
          }}
        />
      </div>
      <div className="flex justify-center items-center col-span-12 mt-3 intro-y sm:justify-end">
        <Button
          variant="primary"
          className="w-20 ml-2 text-xs"
          type="submit"
          disabled={
            selectErrors.country ||
            selectErrors.state ||
            selectErrors.company_currency ||
            selectErrors.time_zone ||
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

export default CompanyInfoJsx;
