import React, { ChangeEvent, useEffect, useState } from "react";
import Lucide from "../../base-components/Lucide";
import { Autocomplete, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { FormInput } from "../../base-components/Form";
import Table from "../../base-components/Table";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import { selectDarkMode } from "../../stores/darkModeSlice";
import { fetchAllCustomersData, getCustomersData } from "../../stores/customer";
import CustomLoader from "../../components/Loader/CustomLoader";
import {
  ITEMS_PER_PAGE_OPTIONS,
  PAGE_LIMIT,
  SUPER_ADMIN,
} from "../../utils/constants";
import { capitalizeByCharacter } from "../../utils/helper";
import CancelSearchText from "../../components/HelperButton/CancelSearchText";
import { fetchAllRoles, getRolesData } from "../../stores/manageRole";
import ResetOrSearchButton from "../../components/HelperButton";
import clsx from "clsx";
import CustomPagination from "../../components/Pagination/CustomPagination";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import moment from "moment";

const filterList = [
  { label: "Android", value: "Android" },
  { label: "iOS", value: "IOS" },
  { label: "All", value: "All" },
];

const today = new Date();
const calculateDateBefore3Month = today.setMonth(today.getMonth() - 3);
const datePrior3Month = dayjs(calculateDateBefore3Month);

const index: React.FC = () => {
  const userState: any = useAppSelector(getCustomersData);
  const itemsPerPageOptions: number[] = ITEMS_PER_PAGE_OPTIONS;
  const [itemsPerPage, setItemsPerPage] = useState<number>(PAGE_LIMIT);
  const [limit, setLimit] = useState<number>(userState.limit);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterUser, setFilterUser] = useState<string>("All");
  const [filterRole, setFilterRole] = useState<string | number>("");
  const [startDate, setStartDate] = useState<Dayjs | null | string>(
    datePrior3Month
  );
  const [endDate, setEndDate] = useState<Dayjs | null | string>(
    new Date().toString()
  );

  const totalPages: number = Math.ceil(
    userState.totalRecords / userState.limit
  );
  let startIndex: number = (currentPage - 1) * itemsPerPage;
  let endIndex: number = Math.min(
    startIndex + itemsPerPage,
    userState.users.length
  );

  const darkMode = useAppSelector(selectDarkMode);
  const dispatch = useAppDispatch();
  const [searchText, setSearchText] = useState<string>("");
  const { roles } = useAppSelector(getRolesData);
  const roleDropdown = roles?.filter((data) => data?.name !== SUPER_ADMIN);

  if (endIndex - startIndex < itemsPerPage) {
    startIndex = Math.max(0, userState.users.length - itemsPerPage);
    endIndex = userState.users.length;
  }

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const sortedItems = [...userState.users].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.id - b.id;
    } else {
      return b.id - a.id;
    }
  });

  const displayedUser = sortedItems.slice(startIndex, endIndex);

  useEffect(() => {
    const fetchCustomers = async () => {
      await dispatch(
        fetchAllCustomersData({
          limit: PAGE_LIMIT,
          page: currentPage,
          searchText,
          ...(filterUser !== "All" && {
            device_type: filterUser,
          }),
          ...(filterRole && {
            user_role: Number(filterRole),
          }),
          ...(startDate !== null && {
            start_date: dayjs(startDate).format("YYYY-MM-DD"),
          }),
          ...(endDate !== null && {
            end_date: dayjs(endDate).format("YYYY-MM-DD"),
          }),
        })
      );
      dispatch(fetchAllRoles());
    };
    fetchCustomers();
  }, []);

  const { control } = useForm({
    mode: "onChange",
  });

  const handleSearchAndFilter = async () => {
    try {
      setIsSearchLoading(true);
      const newLimit = itemsPerPage;
      setItemsPerPage(newLimit);
      setLimit(newLimit);
      await dispatch(
        fetchAllCustomersData({
          limit,
          page: 1,
          searchText,
          ...(filterUser !== "All" && {
            device_type: filterUser,
          }),
          ...(filterRole && {
            user_role: Number(filterRole),
          }),
          ...(startDate !== null && {
            start_date: dayjs(startDate).format("YYYY-MM-DD"),
          }),
          ...(endDate !== null && {
            end_date: dayjs(endDate).format("YYYY-MM-DD"),
          }),
        })
      );
    } catch (error) {
      console.log("Err--", error);
    } finally {
      setIsSearchLoading(false);
      setCurrentPage(1);
    }
  };

  const resetFilter = async () => {
    setSearchText("");
    setFilterUser("All");
    setFilterRole("");
    setItemsPerPage(PAGE_LIMIT);
    setLimit(PAGE_LIMIT);
    setStartDate(datePrior3Month);
    setEndDate(new Date().toString());
    try {
      setIsResetLoading(true);
      await dispatch(
        fetchAllCustomersData({
          limit: PAGE_LIMIT,
          page: 1,
        })
      );
    } catch (error) {
      console.log("Err--", error);
    } finally {
      setIsResetLoading(false);
      setCurrentPage(1);
    }
  };

  const filterByRole = (selectedVal: string) => {
    setFilterRole(selectedVal);
  };

  const handlePageChange = async (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      await dispatch(
        fetchAllCustomersData({
          limit,
          page: pageNumber,
          searchText,
          ...(filterUser !== "All" && {
            device_type: filterUser,
          }),
          ...(filterRole && {
            user_role: Number(filterRole),
          }),
          ...(startDate !== null && {
            start_date: dayjs(startDate).format("YYYY-MM-DD"),
          }),
          ...(endDate !== null && {
            end_date: dayjs(endDate).format("YYYY-MM-DD"),
          }),
        })
      );
      setCurrentPage(pageNumber);
    }
  };

  const handleItemsPerPageChange = async (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    const newItemsPerPage = parseInt(event.target.value);
    setItemsPerPage(newItemsPerPage);
    setLimit(newItemsPerPage);
    await dispatch(
      fetchAllCustomersData({
        limit: newItemsPerPage,
        page: 1,
        searchText,
        ...(filterUser !== "All" && {
          device_type: filterUser,
        }),
        ...(filterRole && {
          user_role: Number(filterRole),
        }),
        ...(startDate !== null && {
          start_date: dayjs(startDate).format("YYYY-MM-DD"),
        }),
        ...(endDate !== null && {
          end_date: dayjs(endDate).format("YYYY-MM-DD"),
        }),
      })
    );
    setCurrentPage(1);
  };

  const filterByJobStartDate = (selectedDate: Dayjs | string | null) => {
    setStartDate(selectedDate);
    if (selectedDate !== null && dayjs(endDate).isBefore(selectedDate)) {
      setEndDate(selectedDate);
    }
  };

  const filterByJobEndDate = (selectedDate: Dayjs | string | null) => {
    setEndDate(selectedDate);
    if (selectedDate !== null && dayjs(startDate).isAfter(selectedDate)) {
      setStartDate(selectedDate);
    }
  };

  return (
    <>
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-3 sm:mt-5">
          {/* Search */}
          <div className="min-w-[200px]">
            <div className="relative text-slate-500">
              <FormInput
                type="text"
                className="dark:text-gray-300"
                placeholder="Search by name, email or phone"
                onChange={(e) => setSearchText(e.target.value)}
                value={searchText}
                name="UserSearch"
              />
              {searchText && <CancelSearchText setSearchText={setSearchText} />}
            </div>
          </div>

          {/* App User Role */}
          <div>
            <Controller
              name="roleStatus"
              control={control}
              render={({ field: { value } }) => {
                const selectedState = roleDropdown?.find(
                  (option) => option.id === value
                );
                const selectedVal = roleDropdown?.find(
                  (option) => option.id === Number(filterRole)
                );
                const defaultValue =
                  (selectedState === undefined ? selectedVal : selectedState) ||
                  null;

                return (
                  <Autocomplete
                    disablePortal
                    size="small"
                    id="combo-box-role"
                    componentsProps={{
                      popper: { modifiers: [{ name: "flip", enabled: false }] },
                    }}
                    value={defaultValue as any}
                    options={roleDropdown?.map((data) => ({
                      value: data.id,
                      label: capitalizeByCharacter(data.name, "_"),
                    }))}
                    getOptionLabel={(option) =>
                      option.label ?? capitalizeByCharacter(option.name, "_")
                    }
                    onChange={(_, newVal) => filterByRole(newVal?.value)}
                    isOptionEqualToValue={(option, value) =>
                      option.value === (value.id ? value.id : null)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select App User Role"
                        className="custom-select w-full"
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
                );
              }}
            />
          </div>

          {/* Device Type */}
          <div>
            <Controller
              name="deviceType"
              control={control}
              render={({ field: { value } }) => {
                const selectedState: any = filterList?.find(
                  (option) => option.value === value
                );
                const selectedVal = filterList?.find(
                  (option) => option.value === filterUser
                );
                const defaultValue =
                  (selectedState === undefined ? selectedVal : selectedState) ||
                  null;

                return (
                  <Autocomplete
                    disablePortal
                    size="small"
                    clearIcon={false}
                    id="combo-box-device"
                    componentsProps={{
                      popper: { modifiers: [{ name: "flip", enabled: false }] },
                    }}
                    value={defaultValue}
                    options={filterList?.map((data) => ({
                      value: data.value,
                      label: data.label,
                    }))}
                    getOptionLabel={(option) => option.label}
                    onChange={(_, newVal) => setFilterUser(newVal?.value)}
                    isOptionEqualToValue={(option, value) =>
                      option.value === (value.value ? value.value : null)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Device Type"
                        className="custom-select w-full"
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
                );
              }}
            />
          </div>

          {/* From Date */}
          <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="From Date"
                value={dayjs(startDate)}
                disableFuture
                slotProps={{
                  textField: { size: "small", error: false },
                  actionBar: { actions: ["clear", "today"] },
                }}
                sx={{ width: "100%" }}
                onChange={(val) => filterByJobStartDate(val)}
              />
            </LocalizationProvider>
          </div>

          {/* To Date */}
          <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="To Date"
                value={dayjs(endDate)}
                disableFuture
                slotProps={{
                  textField: { size: "small", error: false },
                  actionBar: { actions: ["clear", "today"] },
                }}
                sx={{ width: "100%" }}
                onChange={(val) => filterByJobEndDate(val)}
              />
            </LocalizationProvider>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2">
            <ResetOrSearchButton
              type="search"
              disabled={isSearchLoading}
              onClick={handleSearchAndFilter}
            />
            <ResetOrSearchButton
              type="reset"
              disabled={isResetLoading}
              onClick={resetFilter}
            />
          </div>
        </div>

        <div className="mt-3">
          {/* BEGIN: Data List */}
          {userState.loading ? (
            <CustomLoader color="fill-orange-600" />
          ) : (
            <>
              <div className="col-span-12 overflow-auto intro-y">
                <Table className="border-separate -mt-2">
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th
                        className="border-b-0 whitespace-nowrap cursor-pointer flex items-center gap-2"
                        onClick={toggleSortOrder}
                      >
                        <span>#</span>
                        <span>
                          <Lucide
                            icon={sortOrder === "asc" ? "ArrowDown" : "ArrowUp"}
                            className={`w-4 h-4 transform transition ease-in duration-500`}
                          ></Lucide>
                        </span>
                      </Table.Th>
                      <Table.Th className="border-b-0 whitespace-nowrap">
                        Name
                      </Table.Th>
                      <Table.Th className="border-b-0 whitespace-nowrap">
                        Email
                      </Table.Th>
                      <Table.Th className="border-b-0 whitespace-nowrap">
                        Phone
                      </Table.Th>
                      <Table.Th className="border-b-0 whitespace-nowrap w-[100px]">
                        Role
                      </Table.Th>
                      <Table.Th className="border-b-0 whitespace-nowrap w-[20px]">
                        Device Type
                      </Table.Th>
                      <Table.Th className="border-b-0 whitespace-nowrap">
                        Created At
                      </Table.Th>
                      <Table.Th className="border-b-0 whitespace-nowrap">
                        Status
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {displayedUser.map((user: any) => (
                      <Table.Tr key={user.id} className="intro-x">
                        <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-4">
                          <span>{user.id}</span>
                        </Table.Td>
                        <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-4 capitalize">
                          {user.name ? user.name : "-"}
                        </Table.Td>
                        <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-4">
                          <div className="w-[150px] break-words">
                            {user.email ? user.email : "-"}
                          </div>
                        </Table.Td>
                        <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-4 capitalize">
                          {user.phone ? user.phone : "-"}
                        </Table.Td>
                        <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-4 capitalize w-[100px]">
                          {(() => {
                            const role = roleDropdown?.find(
                              (r) => r.id === user.Role.role_id
                            );
                            const roleName = role
                              ? capitalizeByCharacter(role.name, "_")
                              : "-";
                            let colorClass = "";
                            if (user.Role.role_id === 2) {
                              colorClass = "bg-green-100 text-green-700";
                            } else if (user.Role.role_id === 3) {
                              colorClass = "bg-orange-100 text-orange-700";
                            }
                            return roleName !== "-" ? (
                              <span
                                className={`px-3 py-1 rounded font-semibold ${colorClass} inline-block min-w-[100px] text-center`}
                              >
                                {roleName}
                              </span>
                            ) : (
                              "-"
                            );
                          })()}
                        </Table.Td>
                        <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                          <div className="flex items-center w-[20px]">
                            {user.device_type ? user.device_type : "-"}
                          </div>
                        </Table.Td>
                        <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                          <div className="flex items-center">
                            {user.created_at
                              ? moment(user.created_at).format(
                                  "DD-MM-YYYY hh:mm:ss"
                                )
                              : "-"}
                          </div>
                        </Table.Td>
                        <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                          <div className="flex items-center">
                            <span
                              className={`px-2 py-1 rounded font-semibold text-xs
                            ${
                              user.enable
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                            >
                              {user.enable ? "Enabled" : "Disabled"}
                            </span>
                          </div>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </div>
              {userState.users.length === 0 && (
                <h1
                  className={`text-center mt-10 text-xl sm:text-2xl font-medium ${
                    userState.loading ? "text-inherit" : "text-[#8b8a8a]"
                  }`}
                >
                  No data to display...
                </h1>
              )}
              {/* END: Data List */}
              {/* BEGIN: Pagination */}
              {/* {userState.users.length > 0 && ( */}
              <CustomPagination
                currentPage={currentPage}
                darkMode={darkMode}
                handleItemsPerPageChange={handleItemsPerPageChange}
                handlePageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                itemsPerPageOptions={itemsPerPageOptions}
                totalPages={totalPages}
                totalRecords={userState.totalRecords}
              />
              {/* )} */}
              {/* END: Pagination */}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default index;
