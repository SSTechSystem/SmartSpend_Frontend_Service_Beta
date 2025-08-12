import React, { ChangeEvent } from "react";
import { FormInput, FormLabel } from "../../base-components/Form";
import { useAppSelector } from "../../stores/hooks";
import { selectDarkMode } from "../../stores/darkModeSlice";
import Tippy from "../../base-components/Tippy";
import { Controller, useForm } from "react-hook-form";
import { Autocomplete, TextField } from "@mui/material";
import clsx from "clsx";
import Button from "../../base-components/Button";
import LoadingIcon from "../../base-components/LoadingIcon";
import { CompanyBillingInfoProps } from "../../types/Company/companyBillingInfoTypes";
import { SUPER_ADMIN } from "../../utils/constants";
import { getCompaniesData } from "../../stores/company";

const inVoiceOptions = [
  { label: "Weekly", value: 1 },
  { label: "Fortnightly", value: 2 },
  { label: "Monthly", value: 3 },
];

const driverOptions = [
  { label: "All", value: "0" },
  { label: "Company Driver", value: "1" },
  { label: "Freelance Driver", value: "2" },
];

const chargeOptions = [
  { label: "FIX", value: "fix" },
  { label: "%", value: "percent" },
];

const CompanyBillingInfoJsx: React.FC<CompanyBillingInfoProps> = ({
  initFormData,
  formErrors,
  handleInputChange,
  handleSelectChange,
  isLoading,
  role,
}) => {
  const darkMode = useAppSelector(selectDarkMode);
  const { company }: any = useAppSelector(getCompaniesData);

  const { control } = useForm({
    mode: "onChange",
    defaultValues: initFormData,
  });

  return (
    <>
      {role === SUPER_ADMIN &&
        company !== null &&
        Object.keys(company).length === 0 && (
          <div className="col-span-12 intro-y md:col-span-4">
            <FormLabel
              htmlFor="input-wizard-1"
              className="flex justify-between"
            >
              <span>Default Credit Value</span>
              <Tippy
                as="span"
                className="rounded-full shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
                content={`Default credit given by super company`}
              >
                <div className="rounded-full flex justify-center px-2 bg-slate-300 dark:bg-inherit">
                  ?
                </div>
              </Tippy>
            </FormLabel>
            <FormInput
              id="input-wizard-1"
              type="number"
              name="creditValue"
              onInput={(e: ChangeEvent<HTMLInputElement>) => {
                if (Number(e.target.value) >= 0 && e.target.value.length < 8) {
                  handleInputChange(e, "creditValue");
                }
              }}
              placeholder="Default Credit Value"
              value={initFormData.creditValue ? initFormData.creditValue : ""}
            />
          </div>
        )}
      {role === SUPER_ADMIN &&
        company !== null &&
        Object.keys(company).length > 0 && (
          <div className="col-span-12 intro-y md:col-span-4">
            <section className="flex justify-between">
              <span>Default Credit Value</span>
              <Tippy
                as="span"
                className="rounded-full shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
                content={`Default credit given by super company`}
              >
                <div className="rounded-full flex justify-center px-2 bg-slate-300 dark:bg-inherit">
                  ?
                </div>
              </Tippy>
            </section>
            <section className="font-bold capitalize mt-3">
              {initFormData.creditValue ? initFormData.creditValue : 0}
            </section>
          </div>
        )}
      {role === SUPER_ADMIN ? (
        <div className={`col-span-12 sm:col-span-6 md:col-span-4 intro-y`}>
          <FormLabel htmlFor="input-wizard-2" className="flex justify-between">
            <span>
              Service Fees <span className="text-red-600 font-bold">*</span>
            </span>
            <Tippy
              as="span"
              className="rounded-full shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
              content={`Service Fee for each job`}
            >
              <div className="rounded-full flex justify-center px-2 bg-slate-300 dark:bg-inherit">
                ?
              </div>
            </Tippy>
          </FormLabel>
          <FormInput
            id="input-wizard-2"
            type="number"
            name="perJobFees"
            className={clsx({
              "border-danger dark:!border-red-500": formErrors.perJobFees,
            })}
            onInput={(e: ChangeEvent<HTMLInputElement>) => {
              if (Number(e.target.value) > 0 && e.target.value.length < 8) {
                handleInputChange(e, "perJobFees");
              }
            }}
            placeholder="Enter Service Fees"
            value={initFormData.perJobFees ? initFormData.perJobFees : ""}
          />
          {formErrors.perJobFees && (
            <div className="mt-2 text-xs sm:text-sm text-danger dark:text-red-500">
              {typeof formErrors.perJobFees === "string" &&
                formErrors.perJobFees}
            </div>
          )}
        </div>
      ) : (
        <div className="col-span-12 sm:col-span-6 intro-y md:col-span-4">
          <FormLabel htmlFor="input-wizard-1" className="flex justify-between">
            <span>Service Fees</span>
          </FormLabel>
          <section className="font-bold capitalize mt-3">
            {`${initFormData.perJobFees} %`}
          </section>
        </div>
      )}

      {role === SUPER_ADMIN ? (
        <div className={`col-span-12 sm:col-span-6 intro-y md:col-span-4`}>
          <FormLabel htmlFor="input-wizard-22" className="flex justify-between">
            <span>
              Service Fees Type{" "}
              <span className="text-red-600 font-bold">*</span>
            </span>
          </FormLabel>
          <div>
            <Controller
              name="perJobFeeType"
              control={control}
              render={({ field: { onChange } }) => {
                const selectedType = chargeOptions?.find(
                  (option) => option.value === initFormData?.perJobFeeType
                );
                const defaultValue = selectedType || null;
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
                      disableClearable
                      id={`input-wizard-22`}
                      value={defaultValue as any}
                      options={chargeOptions?.map((data) => ({
                        value: data.value,
                        label: data.label,
                      }))}
                      getOptionLabel={(option) => option.label}
                      onChange={(_, newVal) => {
                        onChange(newVal?.value || "");
                        handleSelectChange(
                          newVal?.value || "",
                          "perJobFeeType"
                        );
                      }}
                      isOptionEqualToValue={(option, value) =>
                        option.value === (value.value ? value.value : null)
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Service Fee Type"
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
            {formErrors && formErrors.perJobFeeType && (
              <div className="text-danger text-xs sm:text-sm mt-2 dark:text-red-500">
                {formErrors.perJobFeeType}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className={`col-span-12 sm:col-span-6 intro-y md:col-span-4`}>
          <FormLabel htmlFor="input-wizard-1" className="flex justify-between">
            <span>Service Fees Type</span>
          </FormLabel>
          <section className="font-bold capitalize mt-3">
            {initFormData.perJobFeeType}
          </section>
        </div>
      )}

      <div className="col-span-12 intro-y sm:col-span-6 md:col-span-4">
        <div className="flex justify-between">
          <FormLabel htmlFor="input-wizard-3">Send Invoice Duration</FormLabel>
        </div>
        <Controller
          name="invoiceDuration"
          control={control}
          render={({ field: { onChange } }) => {
            const selectedInvoice = inVoiceOptions?.find(
              (option) => option.value === Number(initFormData.invoiceDuration)
            );

            const defaultValue = selectedInvoice || null;

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
                  id="input-wizard-3"
                  value={defaultValue}
                  options={inVoiceOptions?.map((data) => ({
                    value: data.value,
                    label: data.label,
                  }))}
                  getOptionLabel={(option) => option.label}
                  onChange={(_, newVal) => {
                    onChange(newVal?.value || "");
                    handleSelectChange(
                      String(newVal?.value || ""),
                      "invoiceDuration"
                    );
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option.value === (value.value ? value.value : null)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Invoice"
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
      <div className="col-span-12 intro-y sm:col-span-6 md:col-span-4">
        <div className="flex justify-between">
          <FormLabel htmlFor="input-wizard-4">Allow Driver</FormLabel>
        </div>
        <Controller
          name="driver"
          control={control}
          render={({ field: { onChange } }) => {
            const selectedDriver = driverOptions?.find(
              (option) => option.value === initFormData.driver
            );

            const defaultValue = selectedDriver || null;

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
                  id="input-wizard-4"
                  value={defaultValue}
                  options={driverOptions?.map((data) => ({
                    value: data.value,
                    label: data.label,
                  }))}
                  getOptionLabel={(option) => option.label}
                  onChange={(_, newVal) => {
                    onChange(newVal?.value || "");
                    handleSelectChange(newVal?.value || "", "driver");
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option.value === (value.value ? value.value : null)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Driver"
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
      <div className="col-span-12 intro-y sm:col-span-6 md:col-span-4">
        <FormLabel htmlFor="input-wizard-6" className="flex justify-between">
          Radius (Km)
          <Tippy
            as="span"
            className="rounded-full shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
            content={`Radius will use for send driver job notification within radius on create job`}
          >
            <div className="rounded-full flex justify-center px-2 bg-slate-300 dark:bg-inherit">
              ?
            </div>
          </Tippy>
        </FormLabel>
        <FormInput
          id="input-wizard-6"
          type="number"
          name="radius"
          onInput={(e: ChangeEvent<HTMLInputElement>) => {
            if (Number(e.target.value) >= 0 && e.target.value.length < 8) {
              handleInputChange(e, "radius");
            }
          }}
          placeholder="Enter Radius in Km"
          value={initFormData.radius ? initFormData.radius : ""}
        />
      </div>

      <div className="col-span-12 text-xs text-red-600 dark:text-red-500">
        By pressing Update Company button You will Agree to the Billing Settings
        & Conditions
      </div>

      <div className="flex justify-center items-center col-span-12 mt-3 intro-y sm:justify-end">
        <Button
          variant="primary"
          type="submit"
          disabled={
            Object.values(formErrors).some((err) => err !== "") || isLoading
          }
          className="text-xs"
        >
          {isLoading ? (
            <>
              Update Company
              <LoadingIcon icon="oval" color="white" className="w-4 h-4 ml-2" />
            </>
          ) : (
            "Update Company"
          )}
        </Button>
      </div>
    </>
  );
};

export default CompanyBillingInfoJsx;
