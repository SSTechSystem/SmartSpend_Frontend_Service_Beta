import React, { ChangeEvent, useState } from "react";
import { FormInput, FormLabel } from "../../base-components/Form";
import clsx from "clsx";
import { Controller, useForm } from "react-hook-form";
import { Autocomplete, TextField } from "@mui/material";
import { useAppSelector } from "../../stores/hooks";
import { selectDarkMode } from "../../stores/darkModeSlice";
import timeZoneData from "../../utils/timezoneData";
import {
  getAccountDropdownData,
  getCompanyDropdownData,
  getCountriesData,
  getDriverDropdownData,
  getStatesData,
} from "../../stores/commonList";
import Button from "../../base-components/Button";
import LoadingIcon from "../../base-components/LoadingIcon";
import { getRolesData } from "../../stores/manageRole";
import { UserFormProps } from "../../types/User/addUserFormTypes";
import { useNavigate } from "react-router-dom";
import { openImageInNewTab } from "../../utils/helper";
import Lucide from "../../base-components/Lucide";
import {
  ACCOUNT,
  ACCOUNT_STANDARD,
  COMPANY_ADMIN,
  COMPANY_STANDARD,
  DRIVER,
} from "../../utils/constants";
import secureLocalStorage from "react-secure-storage";

type ListOptions = {
  name: string;
  id: number;
  driver_code?: string;
};

type RoleOptions = {
  role_name: string;
  id: number;
};

const AddUserFormJsx: React.FC<UserFormProps> = ({
  initFormData,
  formErrors,
  handleInputChange,
  handleSelectChange,
  handleImageChange,
  selectErrors,
  setIsCountrySelected,
  previewImage,
  profileImageError,
  isCountrySelected,
  isRoleSelected,
  isLoading,
  selectedRole,
  setIsRoleSelected,
  setSelectedRole,
}) => {
  const { roles }: any = useAppSelector(getRolesData);
  const countryOptions: any = useAppSelector(getCountriesData);
  const stateOptions: any = useAppSelector(getStatesData);
  const companyDropdownOptions: any = useAppSelector(getCompanyDropdownData);
  const driverDropdownOptions: any = useAppSelector(getDriverDropdownData);
  const accountDropdownOptions: any = useAppSelector(getAccountDropdownData);
  const darkMode = useAppSelector(selectDarkMode);
  const isUserAdded = secureLocalStorage.getItem("newlyAddedUser");
  const [showPassword, setShowPassword] = useState(false);

  const enabledRoles = roles?.filter((role: any) => role.enable === 1);
  const navigate = useNavigate();

  const { control } = useForm({
    mode: "onChange",
    defaultValues: initFormData,
  });

  return (
    <>
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
          maxLength={50}
          autoComplete="name"
          aria-autocomplete="inline"
          placeholder="Enter Name"
          value={initFormData.name}
        />
        {formErrors.name && (
          <div className="mt-2 text-xs sm:text-sm text-danger dark:text-red-500">
            {typeof formErrors.name === "string" && formErrors.name}
          </div>
        )}
      </div>
      <div className="col-span-12 intro-y sm:col-span-6 md:col-span-4">
        <FormLabel htmlFor="input-wizard-2">
          Country <span className="text-red-600 font-bold">*</span>
        </FormLabel>
        <Controller
          name="country"
          control={control}
          render={({ field: { onChange, value } }) => {
            const selectedState: any = countryOptions.find(
              (option: ListOptions) => option.id === Number(value)
            );
            const selectedCountry = countryOptions?.find(
              (option: ListOptions) =>
                option.id === Number(initFormData.country)
            );
            const defaultValue =
              (selectedState === undefined ? selectedCountry : selectedState) ||
              null;
            return (
              <>
                <Autocomplete
                  disablePortal
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
                    "border-danger": selectErrors.country,
                  })}
                  size="small"
                  id="input-wizard-2"
                  value={defaultValue}
                  options={countryOptions?.map((data: ListOptions) => ({
                    value: data.id,
                    label: data.name,
                  }))}
                  getOptionLabel={(option) => option.label ?? option.name}
                  onChange={(_, newVal) => {
                    onChange(newVal?.value || "");
                    handleSelectChange(newVal?.value || "", "country");
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
      <div
        className={`col-span-12 intro-y sm:col-span-6 md:col-span-4 flex flex-col justify-center ${
          initFormData.profile_pic && "mt-3"
        } ${formErrors.name || selectErrors.country ? "sm:-mt-7" : "sm:mt-0"} ${
          profileImageError.profile_pic &&
          (formErrors.name || selectErrors.country) &&
          "sm:mt-0"
        }`}
      >
        <FormLabel className="flex gap-5" htmlFor="input-wizard-16">
          <div>Profile Pic</div>
          {Object.keys(previewImage).length > 0 &&
          previewImage.profile_pic !== null &&
          typeof initFormData.profile_pic === "object" ? (
            <div className="w-9 h-9 image-fit -mt-5 shadow-lg">
              <img
                alt="Preview"
                className="rounded-full cursor-pointer"
                src={String(previewImage.profile_pic)}
              />
            </div>
          ) : (
            <>
              {typeof initFormData.profile_pic === "string" &&
                initFormData.profile_pic && (
                  <div className="w-9 h-9 image-fit -mt-5 shadow-lg">
                    <img
                      alt="Logo"
                      className="rounded-full cursor-pointer"
                      src={`${import.meta.env.VITE_REACT_APP_USER_IMAGE_URL}/${
                        initFormData.profile_pic
                      }`}
                      onClick={() =>
                        openImageInNewTab(
                          `${import.meta.env.VITE_REACT_APP_USER_IMAGE_URL}/${
                            initFormData.profile_pic
                          }`
                        )
                      }
                    />
                  </div>
                )}
            </>
          )}
        </FormLabel>
        <FormInput
          id="input-wizard-16"
          className={`py-[0.3rem] border border-slate-200 px-3 ${
            profileImageError.profile_pic && "border-danger dark:border-red-500"
          }`}
          type="file"
          onChange={(e) => handleImageChange(e, "profile_pic")}
        />
        {profileImageError.profile_pic && (
          <div className="mt-2 text-xs sm:text-sm text-danger dark:text-red-500">
            {typeof profileImageError.profile_pic === "string" &&
              profileImageError.profile_pic}
          </div>
        )}
      </div>
      <div className="col-span-12 intro-y sm:col-span-6 md:col-span-4">
        <FormLabel htmlFor="input-wizard-3">
          Email Address <span className="text-red-600 font-bold">*</span>
        </FormLabel>
        <FormInput
          id="input-wizard-3"
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
        <FormLabel htmlFor="input-wizard-12">
          Building Name / Address 1{" "}
          <span className="text-red-600 font-bold">*</span>
        </FormLabel>
        <FormInput
          id="input-wizard-12"
          type="text"
          name="building_name"
          className={clsx({
            "border-danger dark:!border-red-500": formErrors.building_name,
          })}
          maxLength={50}
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, "building_name")
          }
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
        <FormLabel htmlFor="input-wizard-13">
          Street Address / Address 2
        </FormLabel>
        <FormInput
          id="input-wizard-13"
          type="text"
          name="street_address"
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, "street_address")
          }
          maxLength={50}
          autoComplete="street_address"
          aria-autocomplete="inline"
          className={`${
            formErrors.street_address && "border-danger dark:!border-red-500"
          }`}
          placeholder="Street Address"
          value={initFormData.street_address ? initFormData.street_address : ""}
        />
        {formErrors && formErrors.street_address && (
          <div className="mt-2 text-xs sm:text-sm text-danger dark:text-red-500">
            {formErrors.street_address}
          </div>
        )}
      </div>
      <div className={`intro-y col-span-12 sm:col-span-6 md:col-span-4`}>
        <FormLabel htmlFor="input-wizard-4">
          Timezone <span className="text-red-600 font-bold">*</span>
        </FormLabel>
        <Controller
          name="time_zone"
          control={control}
          render={({ field: { onChange, value } }) => {
            const selectedState: any = timeZoneData.find(
              (option: string) => option === value
            );
            const selectedTimeZone: any = timeZoneData?.find(
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
                    "border-danger": selectErrors.time_zone,
                  })}
                  id="input-wizard-4"
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
      <div className="col-span-12 intro-y sm:col-span-6 md:col-span-4">
        <FormLabel htmlFor="input-wizard-8">
          State <span className="text-red-600 font-bold">*</span>
        </FormLabel>
        <Controller
          name="state"
          control={control}
          render={({ field: { onChange } }) => {
            const selectedOneState = stateOptions?.find(
              (option: ListOptions) => option.id === Number(initFormData.state)
            );
            const defaultValue = !isCountrySelected
              ? null
              : selectedOneState || null;
            return (
              <>
                <Autocomplete
                  size="small"
                  id="input-wizard-8"
                  value={!isCountrySelected ? null : defaultValue}
                  options={stateOptions?.map((data: ListOptions) => ({
                    value: data.id,
                    label: data.name,
                  }))}
                  getOptionLabel={(option) => option.label ?? option.name}
                  onChange={(_, newVal) => {
                    onChange(newVal?.value || "");
                    handleSelectChange(newVal?.value, "state");
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
      <div className="col-span-12 intro-y sm:col-span-6 md:col-span-4">
        <FormLabel htmlFor="input-wizard-11">
          Suburb / City <span className="text-red-600 font-bold">*</span>
        </FormLabel>
        <FormInput
          id="input-wizard-11"
          type="text"
          name="city"
          className={clsx({
            "border-danger dark:!border-red-500": formErrors.city,
          })}
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, "city")
          }
          minLength={3}
          maxLength={50}
          placeholder="Enter City"
          value={initFormData.city}
        />
        {formErrors.city && (
          <div className="mt-2 text-xs sm:text-sm text-danger dark:text-red-500">
            {typeof formErrors.city === "string" && formErrors.city}
          </div>
        )}
      </div>
      {!isUserAdded && (
        <div className="col-span-12 intro-y sm:col-span-6 md:col-span-4">
          <FormLabel htmlFor="input-wizard-5">
            Password <span className="text-red-600 font-bold">*</span>
          </FormLabel>
          <FormInput
            id="input-wizard-5"
            type={showPassword ? "text" : "password"}
            name="password"
            className={clsx({
              "border-danger dark:!border-red-500": formErrors.password,
            })}
            onInput={(e: ChangeEvent<HTMLInputElement>) =>
              handleInputChange(e, "password")
            }
            minLength={5}
            maxLength={20}
            placeholder="Enter Password"
            value={initFormData.password}
          />
          <div
            className={`absolute inset-y-0 right-2 flex items-center cursor-pointer ${
              !formErrors.password &&
              !formErrors.pincode &&
              !formErrors.contact_no
                ? "mt-7"
                : "mt-0"
            }`}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <Lucide icon="EyeOff" className="h-5 w-5 text-gray-500" />
            ) : (
              <Lucide icon="Eye" className="h-5 w-5 text-gray-500" />
            )}
          </div>
          {formErrors.password && (
            <div className="mt-2 text-xs sm:text-sm text-danger dark:text-red-500">
              {typeof formErrors.password === "string" && formErrors.password}
            </div>
          )}
        </div>
      )}
      <div className={`col-span-12 intro-y sm:col-span-6 md:col-span-4`}>
        <FormLabel htmlFor="input-wizard-14">
          Pincode <span className="text-red-600 font-bold">*</span>
        </FormLabel>
        <FormInput
          id="input-wizard-14"
          type="text"
          name="pincode"
          className={clsx({
            "border-danger dark:!border-red-500": formErrors.pincode,
          })}
          minLength={3}
          maxLength={10}
          onInput={(e: ChangeEvent<HTMLInputElement>) =>
            handleInputChange(e, "pincode")
          }
          placeholder="Enter Pincode"
          value={initFormData.pincode}
        />
        {formErrors.pincode && (
          <div className="mt-2 text-xs sm:text-sm text-danger dark:text-red-500">
            {typeof formErrors.pincode === "string" && formErrors.pincode}
          </div>
        )}
      </div>
      <div className={`col-span-12 intro-y sm:col-span-6 md:col-span-4`}>
        <FormLabel htmlFor="input-wizard-15">
          Contact No <span className="text-red-600 font-bold">*</span>
        </FormLabel>
        <FormInput
          id="input-wizard-15"
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
      {/* Role Select */}
      {isUserAdded ? (
        <div className="col-span-12 sm:col-span-6 intro-y md:col-span-4">
          <span>Role</span>
          <section className="font-bold uppercase mt-3">
            {initFormData.role}
          </section>
        </div>
      ) : (
        <div className="col-span-12 intro-y md:col-span-4">
          <FormLabel htmlFor="input-wizard-9">
            Role Select <span className="text-red-600 font-bold">*</span>
          </FormLabel>
          <Controller
            name="role"
            control={control}
            render={({ field: { onChange } }) => {
              const selectedRole = enabledRoles?.find(
                (option: RoleOptions) => option.id === Number(initFormData.role)
              );
              const defaultValue = selectedRole || null;
              return (
                <>
                  <Autocomplete
                    className={clsx({
                      "border-danger": selectErrors.role,
                    })}
                    size="small"
                    id="input-wizard-9"
                    value={defaultValue}
                    options={enabledRoles?.map((data: RoleOptions) => ({
                      value: data.id,
                      label: data.role_name.toLocaleUpperCase(),
                    }))}
                    getOptionLabel={(option) =>
                      option.label ?? option.role_name?.toLocaleUpperCase()
                    }
                    onChange={(_, newVal) => {
                      onChange(newVal?.value || "");
                      setSelectedRole(newVal);
                      handleSelectChange(newVal?.value, "role");
                      if (newVal?.value) {
                        setIsRoleSelected(true);
                      } else {
                        setIsRoleSelected(false);
                      }
                    }}
                    isOptionEqualToValue={(option, value) =>
                      option.value === (value.id ? value.id : null)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Role"
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
                  {selectErrors.role && (
                    <div className="mt-2 text-xs sm:text-sm text-danger dark:text-red-500">
                      {typeof selectErrors.role === "string" &&
                        selectErrors.role}
                    </div>
                  )}
                </>
              );
            }}
          />
        </div>
      )}
      {/* Company Select */}
      {isUserAdded && initFormData.companySelect ? (
        <div className="col-span-12 sm:col-span-6 intro-y md:col-span-4">
          <span>Company Name</span>
          <section className="font-bold uppercase mt-3">
            {initFormData.companySelect}
          </section>
        </div>
      ) : (
        <>
          {isRoleSelected &&
            (selectedRole?.label === COMPANY_ADMIN.toLocaleUpperCase() ||
              selectedRole?.label === COMPANY_STANDARD.toLocaleUpperCase()) && (
              <div className="col-span-12 sm:col-span-6 md:col-span-4">
                <FormLabel htmlFor="input-wizard-6">
                  Company Select{" "}
                  <span className="text-red-600 font-bold">*</span>
                </FormLabel>
                <Controller
                  name="companySelect"
                  control={control}
                  render={({ field: { onChange } }) => {
                    const selectedCompany = companyDropdownOptions?.find(
                      (option: ListOptions) =>
                        option.id === Number(initFormData.companySelect)
                    );
                    const defaultValue = !isRoleSelected
                      ? null
                      : selectedCompany || null;
                    return (
                      <>
                        <Autocomplete
                          className={clsx({
                            "border-danger": selectErrors.companySelect,
                          })}
                          size="small"
                          id="input-wizard-6"
                          value={!isRoleSelected ? null : defaultValue}
                          options={companyDropdownOptions?.map(
                            (data: ListOptions) => ({
                              value: data.id,
                              label: data.name,
                            })
                          )}
                          getOptionLabel={(option) =>
                            option.label ?? option.name
                          }
                          onChange={(_, newVal) => {
                            onChange(newVal?.value || "");
                            handleSelectChange(
                              newVal?.value || "",
                              "companySelect"
                            );
                          }}
                          isOptionEqualToValue={(option, value) =>
                            option.value === (value.id ? value.id : null)
                          }
                          disabled={isUserAdded ? true : false}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Company"
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
                        {selectErrors.companySelect && (
                          <div className="mt-2 text-xs sm:text-sm text-danger dark:text-red-500">
                            {typeof selectErrors.companySelect === "string" &&
                              selectErrors.companySelect}
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
      {/* Account Select */}
      {isUserAdded && initFormData.accountsSelect ? (
        <div className="col-span-12 sm:col-span-6 intro-y md:col-span-4">
          <span>Accounts Name</span>
          <section className="font-bold uppercase mt-3">
            {initFormData.accountsSelect}
          </section>
        </div>
      ) : (
        <>
          {isRoleSelected &&
            (selectedRole?.label === ACCOUNT.toLocaleUpperCase() ||
              selectedRole?.label === ACCOUNT_STANDARD.toLocaleUpperCase()) && (
              <div className="col-span-12 sm:col-span-6 md:col-span-4">
                <FormLabel htmlFor="input-wizard-7">
                  Accounts Select{" "}
                  <span className="text-red-600 font-bold">*</span>
                </FormLabel>
                <Controller
                  name="accountsSelect"
                  control={control}
                  render={({ field: { onChange } }) => {
                    const selectedAccount = accountDropdownOptions?.find(
                      (option: ListOptions) =>
                        option.id === Number(initFormData.accountsSelect)
                    );
                    const defaultValue = !isRoleSelected
                      ? null
                      : selectedAccount || null;
                    return (
                      <>
                        <Autocomplete
                          className={clsx({
                            "border-danger": selectErrors.accountsSelect,
                          })}
                          size="small"
                          id="input-wizard-7"
                          value={!isRoleSelected ? null : defaultValue}
                          options={accountDropdownOptions?.map(
                            (data: ListOptions) => ({
                              value: data.id,
                              label: data.name,
                            })
                          )}
                          getOptionLabel={(option) =>
                            option.label ?? option.name
                          }
                          onChange={(_, newVal) => {
                            onChange(newVal?.value || "");
                            handleSelectChange(
                              newVal?.value || "",
                              "accountsSelect"
                            );
                          }}
                          isOptionEqualToValue={(option, value) =>
                            option.value === (value.id ? value.id : null)
                          }
                          disabled={isUserAdded ? true : false}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Accounts"
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
                        {selectErrors.accountsSelect && (
                          <div className="mt-2 text-xs sm:text-sm text-danger dark:text-red-500">
                            {typeof selectErrors.accountsSelect === "string" &&
                              selectErrors.accountsSelect}
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
      {/* Driver Select */}
      {isUserAdded && initFormData.driverSelect ? (
        <div className="col-span-12 sm:col-span-6 intro-y md:col-span-4">
          <span>Driver Name</span>
          <section className="font-bold uppercase mt-3">
            {initFormData.driverSelect}
          </section>
        </div>
      ) : (
        <>
          {isRoleSelected &&
            selectedRole?.label === DRIVER.toLocaleUpperCase() && (
              <div className="col-span-12 sm:col-span-6 md:col-span-4">
                <FormLabel htmlFor="input-wizard-66">
                  Driver Select{" "}
                  <span className="text-red-600 font-bold">*</span>
                </FormLabel>
                <Controller
                  name="driverSelect"
                  control={control}
                  render={({ field: { onChange } }) => {
                    const selectedDriver = driverDropdownOptions?.find(
                      (option: ListOptions) =>
                        option.id === Number(initFormData.driverSelect)
                    );
                    const defaultValue = !isRoleSelected
                      ? null
                      : selectedDriver || null;
                    return (
                      <>
                        <Autocomplete
                          size="small"
                          id="input-wizard-66"
                          value={!isRoleSelected ? null : defaultValue}
                          options={driverDropdownOptions?.map(
                            (data: ListOptions) => ({
                              value: data.id,
                              label:
                                data.name +
                                " " +
                                (data.driver_code
                                  ? `(${data.driver_code})`
                                  : ""),
                            })
                          )}
                          getOptionLabel={(option) =>
                            option.label ?? option.name
                          }
                          onChange={(_, newVal) => {
                            onChange(newVal?.value || "");
                            handleSelectChange(
                              newVal?.value || "",
                              "driverSelect"
                            );
                          }}
                          isOptionEqualToValue={(option, value) =>
                            option.value === (value.id ? value.id : null)
                          }
                          disabled={isUserAdded ? true : false}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              label="Driver"
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
                        {selectErrors.driverSelect && (
                          <div className="mt-2 text-xs sm:text-sm text-danger dark:text-red-500">
                            {typeof selectErrors.driverSelect === "string" &&
                              selectErrors.driverSelect}
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
      <div className="flex items-center col-span-12 my-3 intro-y">
        <Button
          variant="primary"
          className="text-xs"
          type="submit"
          disabled={
            formErrors.building_name ||
            formErrors.city ||
            formErrors.contact_no ||
            formErrors.email ||
            formErrors.name ||
            formErrors.pincode ||
            Object.values(selectErrors).some((error) => error !== "") ||
            profileImageError.profile_pic ||
            isLoading
              ? true
              : false
          }
        >
          {isLoading ? (
            <>
              {isUserAdded ? "Update User" : "Save User"}
              <LoadingIcon icon="oval" color="white" className="w-4 h-4 ml-2" />
            </>
          ) : (
            <>{isUserAdded ? "Update User" : "Save User"}</>
          )}
        </Button>
        {isUserAdded && (
          <Button
            variant="instagram"
            className="ml-2 text-xs"
            type="button"
            onClick={() => {
              secureLocalStorage.removeItem("newlyAddedUser");
              navigate("/user");
            }}
          >
            Cancel
          </Button>
        )}
      </div>
    </>
  );
};

export default AddUserFormJsx;
