import React, { useState, useEffect, ChangeEvent } from "react";
import Table from "../../base-components/Table";
import Lucide from "../../base-components/Lucide";
import Button from "../../base-components/Button";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import {
  fetchAllSystemLogs,
  fetchModuleNamesDropdown,
  fetchSingleSystemLog,
  getLogsData,
} from "../../stores/logs";
import { selectDarkMode } from "../../stores/darkModeSlice";
import moment from "moment";
import clsx from "clsx";
import {
  DATE_TIME_FORMAT,
  ERROR_TEXT,
  ITEMS_PER_PAGE_OPTIONS,
  PAGE_LIMIT,
  SUCCESS_TEXT,
  SUPER_ADMIN,
} from "../../utils/constants";
import { Dialog, DialogContent } from "@mui/material";
import { useForm } from "react-hook-form";
import dayjs, { Dayjs } from "dayjs";
import secureLocalStorage from "react-secure-storage";
import { useNavigate } from "react-router-dom";
import CustomLoader from "../../components/Loader/CustomLoader";
import { capitalizeByCharacter } from "../../utils/helper";
import CustomPagination from "../../components/Pagination/CustomPagination";
import { SlideTransition } from "../../components/Transition/SlideTransition";
import LoaderIcon from "../../components/Loader/LoaderIcon";
import SystemLogsFilters from "../../components/LogsManagement/SystemLogsFilters";

const today = new Date();
const calculateDateBefore1Month = today.setMonth(today.getMonth() - 1);
const datePrior1Month = dayjs(calculateDateBefore1Month);

const SystemLogs: React.FC = () => {
  const role = secureLocalStorage.getItem("role");
  const systemLogsState: any = useAppSelector(getLogsData);
  const [systemLogModal, setSystemLogModal] = useState<boolean>(false);
  const [selectedSystemId, setSelectedSystemId] = useState<number | null>(null);
  const itemsPerPageOptions: number[] = ITEMS_PER_PAGE_OPTIONS;
  const [itemsPerPage, setItemsPerPage] = useState<number>(PAGE_LIMIT);
  const [limit, setLimit] = useState<number>(systemLogsState.limit);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const darkMode = useAppSelector(selectDarkMode);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filterSystemLogs, setFilterSystemLogs] = useState<string>("all");
  const [filterModule, setFilterModule] = useState<string>("");
  const [startDate, setStartDate] = useState<Dayjs | null | string>(
    datePrior1Month
  );
  const [endDate, setEndDate] = useState<Dayjs | null | string>(
    new Date().toString()
  );
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const totalPages: number = Math.ceil(
    systemLogsState.totalRecords / systemLogsState.limit
  );
  let startIndex: number = (currentPage - 1) * itemsPerPage;
  let endIndex: number = Math.min(
    startIndex + itemsPerPage,
    systemLogsState.systemLogs.length
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  if (endIndex - startIndex < itemsPerPage) {
    startIndex = Math.max(0, systemLogsState.systemLogs.length - itemsPerPage);
    endIndex = systemLogsState.systemLogs.length;
  }

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const sortedItems = [...systemLogsState.systemLogs].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.id - b.id;
    } else {
      return b.id - a.id;
    }
  });

  const displayedSystemLogs = sortedItems.slice(startIndex, endIndex);
  const systemLogData = systemLogsState.systemLog;

  useEffect(() => {
    const fetchSystemLogs = async () => {
      if (role === SUPER_ADMIN) {
        await dispatch(
          fetchAllSystemLogs({
            limit: PAGE_LIMIT,
            page: currentPage,
            ...(filterModule && {
              module: filterModule,
            }),
            ...(filterSystemLogs !== "all" && {
              res_type:
                filterSystemLogs === "success" ? SUCCESS_TEXT : ERROR_TEXT,
            }),
            ...(startDate !== null && {
              start_date: dayjs(startDate).format("YYYY-MM-DD"),
            }),
            ...(endDate !== null && {
              end_date: dayjs(endDate).format("YYYY-MM-DD"),
            }),
          })
        );
        await dispatch(fetchModuleNamesDropdown());
      } else {
        navigate("/unauthorized");
      }
    };
    fetchSystemLogs();
  }, []);

  useEffect(() => {
    const fetchSystemLogData = async () => {
      if (systemLogModal) {
        try {
          setIsLoading(true);
          await dispatch(fetchSingleSystemLog(Number(selectedSystemId)));
        } catch (error) {
          console.log("Err--", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchSystemLogData();
  }, [systemLogModal]);

  const searchDataInSystemLogs = async () => {
    try {
      setIsSearchLoading(true);
      const newLimit = itemsPerPage;
      setItemsPerPage(newLimit);
      setLimit(newLimit);
      await dispatch(
        fetchAllSystemLogs({
          limit: PAGE_LIMIT,
          page: currentPage,
          ...(filterModule && {
            module: filterModule,
          }),
          ...(filterSystemLogs !== "all" && {
            res_type:
              filterSystemLogs === "success" ? SUCCESS_TEXT : ERROR_TEXT,
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
      console.log("Er--", error);
    } finally {
      setIsSearchLoading(false);
      setCurrentPage(1);
    }
  };

  const resetFilter = async () => {
    setFilterSystemLogs("all");
    setFilterModule("");
    setStartDate(datePrior1Month);
    setEndDate(new Date().toString());
    setItemsPerPage(PAGE_LIMIT);
    setLimit(PAGE_LIMIT);
    try {
      setIsResetLoading(true);
      await dispatch(
        fetchAllSystemLogs({
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

  const changeSystemLogStatus = (selectedValue: string) => {
    setFilterSystemLogs(selectedValue);
  };

  const filterByModule = (selectedValue: string) => {
    setFilterModule(selectedValue);
  };

  const filterByLogsStartDate = (selectedDate: Dayjs | string | null) => {
    setStartDate(selectedDate);
    if (selectedDate !== null && dayjs(endDate).isBefore(selectedDate)) {
      setEndDate(selectedDate);
    }
  };

  const filterByLogsEndDate = (selectedDate: Dayjs | string | null) => {
    setEndDate(selectedDate);
    if (selectedDate !== null && dayjs(startDate).isAfter(selectedDate)) {
      setStartDate(selectedDate);
    }
  };

  const handlePageChange = async (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      await dispatch(
        fetchAllSystemLogs({
          limit,
          page: pageNumber,
          ...(filterModule && {
            module: filterModule,
          }),
          ...(filterSystemLogs !== "all" && {
            res_type:
              filterSystemLogs === "success" ? SUCCESS_TEXT : ERROR_TEXT,
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
      fetchAllSystemLogs({
        limit: newItemsPerPage,
        page: 1,
        ...(filterModule && {
          module: filterModule,
        }),
        ...(filterSystemLogs !== "all" && {
          res_type: filterSystemLogs === "success" ? SUCCESS_TEXT : ERROR_TEXT,
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

  const { control } = useForm({
    mode: "onChange",
  });

  const openSystemLogModal = (id: number) => {
    setSelectedSystemId(id);
    setSystemLogModal(true);
  };

  return (
    <>
      {role === SUPER_ADMIN && (
        <>
          <SystemLogsFilters
            changeSystemLogStatus={changeSystemLogStatus}
            control={control}
            darkMode={darkMode}
            endDate={endDate}
            filterByLogsEndDate={filterByLogsEndDate}
            filterByLogsStartDate={filterByLogsStartDate}
            filterSystemLogs={filterSystemLogs}
            isSearchLoading={isSearchLoading}
            searchDataInSystemLogs={searchDataInSystemLogs}
            startDate={startDate}
            filterModule={filterModule}
            filterByModule={filterByModule}
            isResetLoading={isResetLoading}
            resetFilter={resetFilter}
          />

          <div className="mt-3">
            {/* BEGIN: Data List */}
            {systemLogsState.loading ? (
              <CustomLoader color="fill-cyan-600" />
            ) : (
              <>
                <div className="col-span-12 overflow-auto intro-y lg:overflow-visible">
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
                              icon={
                                sortOrder === "asc" ? "ArrowDown" : "ArrowUp"
                              }
                              className={`w-4 h-4 transform transition ease-in duration-500`}
                            ></Lucide>
                          </span>
                        </Table.Th>
                        <Table.Th className="border-b-0 whitespace-nowrap">
                          Module
                        </Table.Th>
                        <Table.Th className="border-b-0 whitespace-nowrap">
                          Status
                        </Table.Th>
                        <Table.Th className="border-b-0 whitespace-nowrap">
                          Res Type
                        </Table.Th>
                        <Table.Th className="border-b-0 whitespace-nowrap">
                          Log Date
                        </Table.Th>
                        <Table.Th className="border-b-0 whitespace-nowrap">
                          Message
                        </Table.Th>
                        <Table.Th className="border-b-0 whitespace-nowrap">
                          Action
                        </Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {systemLogsState.systemLogs.length !== 0 &&
                        displayedSystemLogs.map((systemLog: any) => (
                          <Table.Tr key={systemLog.id} className="intro-x">
                            <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                              <span>{systemLog.id}</span>
                            </Table.Td>
                            <Table.Td className="first:rounded-l-md capitalize last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] w-[170px]mr-10">
                              {systemLog?.module
                                ? capitalizeByCharacter(systemLog.module, "_")
                                : "N/A"}
                            </Table.Td>
                            <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                              <div className="w-[30px]">
                                {systemLog?.status_code
                                  ? systemLog.status_code
                                  : "N/A"}
                              </div>
                            </Table.Td>
                            <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                              <div
                                className={clsx({
                                  "flex items-center w-[50px]": true,
                                  "text-success dark:text-green-500":
                                    systemLog.res_type === SUCCESS_TEXT,
                                  "text-danger dark:text-red-500":
                                    systemLog.res_type === ERROR_TEXT,
                                })}
                              >
                                {systemLog?.res_type
                                  ? systemLog.res_type
                                  : "N/A"}
                              </div>
                            </Table.Td>
                            <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                              <div className="flex items-center">
                                {systemLog?.created_at
                                  ? moment(systemLog.created_at).format(
                                      DATE_TIME_FORMAT
                                    )
                                  : "N/A"}
                              </div>
                            </Table.Td>
                            <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                              <div className="truncate w-[300px]">
                                {systemLog?.description
                                  ? systemLog.description
                                  : "N/A"}
                              </div>
                            </Table.Td>
                            <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                              <div className="flex items-center gap-3">
                                <span
                                  className="flex items-center cursor-pointer"
                                  onClick={() =>
                                    openSystemLogModal(systemLog.id)
                                  }
                                >
                                  <Lucide
                                    icon="Eye"
                                    className="w-4 h-4 text-blue-600"
                                  />
                                </span>
                              </div>
                            </Table.Td>
                          </Table.Tr>
                        ))}
                    </Table.Tbody>
                  </Table>
                </div>
                {systemLogsState.systemLogs.length === 0 && (
                  <h1
                    className={`text-center mt-10 text-xl sm:text-2xl font-medium ${
                      systemLogsState.loading
                        ? "text-inherit"
                        : "text-[#8b8a8a]"
                    }`}
                  >
                    No data to display...
                  </h1>
                )}
                {/* END: Data List */}
                {/* BEGIN: Pagination */}
                {/* {systemLogsState.systemLogs.length > 0 && ( */}
                <CustomPagination
                  currentPage={currentPage}
                  darkMode={darkMode}
                  handleItemsPerPageChange={handleItemsPerPageChange}
                  handlePageChange={handlePageChange}
                  itemsPerPage={itemsPerPage}
                  itemsPerPageOptions={itemsPerPageOptions}
                  totalPages={totalPages}
                  totalRecords={systemLogsState.totalRecords}
                />
                {/* )} */}
                {/* END: Pagination */}
              </>
            )}
          </div>

          <Dialog
            open={systemLogModal}
            onClose={() => setSystemLogModal(false)}
            maxWidth="md"
            fullWidth
            TransitionComponent={SlideTransition}
            TransitionProps={{
              timeout: {
                enter: 700,
                exit: 500,
              },
            }}
            key={`systemLog`}
          >
            {systemLogData === null || isLoading ? (
              <DialogContent>
                <LoaderIcon icon="oval" />
              </DialogContent>
            ) : (
              <DialogContent>
                <div className="px-3 pt-3 text-center flex justify-between">
                  <div className="text-xl sm:text-2xl font-medium">
                    System Log Details
                  </div>
                  <Lucide
                    icon="X"
                    className="cursor-pointer hover:text-white hover:bg-slate-500 hover:rounded-full -mr-2 -mt-3 p-1 w-[1.8rem] h-[1.8rem]"
                    onClick={() => setSystemLogModal(false)}
                  />
                </div>
                <div className="h-5 border-b-2 dark:border-slate-200"></div>
                <div className="mt-4 px-3 overflow-y-auto max-h-[350px] text-xs sm:text-sm">
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-2">
                      <strong>Module</strong>
                    </div>
                    <div className="col-span-1">:</div>
                    <div className="col-span-9 info uppercase">
                      {systemLogData.module}
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-4 mt-2">
                    <div className="col-span-2">
                      <strong>Type</strong>
                    </div>
                    <div className="col-span-1">:</div>
                    <div className="col-span-9 info uppercase">
                      {systemLogData.type}
                    </div>
                  </div>
                  <div className="grid grid-cols-12 gap-4 mt-2">
                    <div className="col-span-2">
                      <strong>Log Time</strong>
                    </div>
                    <div className="col-span-1">:</div>
                    <div className="col-span-9 info">
                      {moment(systemLogData.created_at).format(
                        DATE_TIME_FORMAT
                      )}
                    </div>
                  </div>
                  <h5 className="mt-6 mb-2">Request Body</h5>
                  <div className="box dark:border-slate-200 dark:bg-white p-4 rounded-lg">
                    <div className="overflow-y-auto">
                      <p className="whitespace-pre-wrap dark:text-gray-300">
                        {systemLogData?.req_body
                          ? systemLogData.req_body
                          : "--"}
                      </p>
                    </div>
                  </div>
                  <h5 className="mt-6 mb-2">Description:</h5>
                  <div className="box dark:border-slate-200 dark:bg-white p-4 rounded-lg">
                    <div className="overflow-y-auto">
                      <p className="whitespace-pre-wrap dark:text-gray-300">
                        {systemLogData?.description
                          ? systemLogData.description
                          : "--"}
                      </p>
                    </div>
                  </div>
                  <h5 className="mt-4 mb-2">New Values:</h5>
                  <div className="box dark:border-slate-200 dark:bg-white p-4 rounded-lg">
                    <div className="overflow-y-auto">
                      <pre className="whitespace-pre-wrap dark:text-gray-300">
                        {systemLogData?.new_values
                          ? systemLogData.new_values
                          : "--"}
                      </pre>
                    </div>
                  </div>
                  <h5 className="mt-4 mb-2">Old Values:</h5>
                  <div className="box dark:border-slate-200 dark:bg-white p-4 rounded-lg">
                    <div className="overflow-y-auto">
                      <pre className="whitespace-pre-wrap dark:text-gray-300">
                        {systemLogData?.old_values
                          ? systemLogData.old_values
                          : "--"}
                      </pre>
                    </div>
                  </div>
                  <h5 className="mt-4 mb-2">
                    {systemLogData?.res_type === ERROR_TEXT
                      ? ERROR_TEXT
                      : "Response Body"}
                  </h5>
                  <div className="box dark:border-slate-200 dark:bg-white p-4 rounded-lg">
                    <div className="overflow-y-auto">
                      <pre className="whitespace-pre-wrap dark:text-gray-300">
                        {systemLogData?.res_body
                          ? systemLogData.res_body
                          : "--"}
                      </pre>
                    </div>
                  </div>
                </div>
                <div className="px-5 mt-5 text-end">
                  <Button
                    variant="linkedin"
                    type="button"
                    onClick={() => {
                      setSystemLogModal(false);
                    }}
                    className="w-20 text-xs"
                  >
                    Close
                  </Button>
                </div>
              </DialogContent>
            )}
          </Dialog>
        </>
      )}
    </>
  );
};

export default SystemLogs;
