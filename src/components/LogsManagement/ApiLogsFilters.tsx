import { Autocomplete, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs, { Dayjs } from "dayjs";
import React from "react";
import { Control, Controller, FieldValues } from "react-hook-form";
import ResetOrSearchButton from "../HelperButton";
import clsx from "clsx";

interface ApiLogsFiltersProps {
  control: Control<FieldValues, any>;
  darkMode: boolean;
  changeApiLogsStatus: (selectedValue: string) => void;
  filterApiLogs: string;
  startDate: string | Dayjs | null;
  endDate: string | Dayjs | null;
  isSearchLoading: boolean;
  isResetLoading: boolean;
  searchDataInApiLogs: () => Promise<void>;
  resetFilter: () => Promise<void>;
  filterByLogsStartDate: (selectedDate: Dayjs | string | null) => void;
  filterByLogsEndDate: (selectedDate: Dayjs | string | null) => void;
}

const filterList = [
  { label: "Success", value: "success" },
  { label: "Error", value: "error" },
  { label: "All", value: "all" },
];

const ApiLogsFilters: React.FC<ApiLogsFiltersProps> = ({
  control,
  darkMode,
  filterApiLogs,
  endDate,
  startDate,
  isSearchLoading,
  isResetLoading,
  changeApiLogsStatus,
  searchDataInApiLogs,
  filterByLogsEndDate,
  filterByLogsStartDate,
  resetFilter,
}) => {
  return (
    <div className="flex px-2 flex-wrap gap-3 sm:gap-5 justify-between mt-3 sm:mt-5">
      <div className="w-full sm:flex-1">
        <Controller
          name="apiStatus"
          control={control}
          render={({ field: { value } }) => {
            const selectedState: any = filterList?.find(
              (option) => option.value === value
            );
            const selectedVal = filterList?.find(
              (option) => option.value === filterApiLogs
            );
            const defaultValue =
              (selectedState === undefined ? selectedVal : selectedState) ||
              null;
            return (
              <>
                <Autocomplete
                  disablePortal
                  size="small"
                  clearIcon={false}
                  id="combo-box-demo"
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
                  options={filterList?.map((data) => ({
                    value: data.value,
                    label: data.label,
                  }))}
                  getOptionLabel={(option) => option.label}
                  onChange={(_, newVal) => {
                    changeApiLogsStatus(newVal?.value);
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option.value === (value.value ? value.value : null)
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Status"
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
              </>
            );
          }}
        />
      </div>

      <div className="-mt-2 w-full sm:flex-1">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker", "DatePicker"]}>
            <DatePicker
              label="From Date"
              value={dayjs(startDate)}
              disableFuture
              className="dark:bg-darkmode-700"
              slotProps={{
                textField: {
                  size: "small",
                  error: false,
                  style: {
                    fontSize: "12px",
                    width: "100%",
                  },
                },
                actionBar: {
                  actions: ["clear", "today"],
                },
              }}
              onChange={(val) => filterByLogsStartDate(val)}
            />
          </DemoContainer>
        </LocalizationProvider>
      </div>

      <div className="-mt-2 w-full sm:flex-1">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker", "DatePicker"]}>
            <DatePicker
              label="To Date"
              value={dayjs(endDate)}
              disableFuture
              className="dark:bg-darkmode-700"
              slotProps={{
                textField: {
                  size: "small",
                  error: false,
                  style: {
                    fontSize: "12px",
                    width: "100%",
                  },
                },
                actionBar: {
                  actions: ["clear", "today"],
                },
              }}
              onChange={(val) => filterByLogsEndDate(val)}
            />
          </DemoContainer>
        </LocalizationProvider>
      </div>

      <ResetOrSearchButton
        type="search"
        disabled={isSearchLoading}
        onClick={searchDataInApiLogs}
      />

      <ResetOrSearchButton
        disabled={isResetLoading}
        onClick={resetFilter}
        type="reset"
      />
    </div>
  );
};

export default ApiLogsFilters;
