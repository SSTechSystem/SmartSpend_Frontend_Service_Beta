import React, { useState, useEffect, ChangeEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import {
  fetchAllApiLogs,
  fetchSingleApiLog,
  getLogsData,
} from "../../stores/logs";
import { selectDarkMode } from "../../stores/darkModeSlice";
import Table from "../../base-components/Table";
import Lucide from "../../base-components/Lucide";
import Button from "../../base-components/Button";
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
import secureLocalStorage from "react-secure-storage";
import dayjs, { Dayjs } from "dayjs";
import { useNavigate } from "react-router-dom";
import LoaderIcon from "../../components/Loader/LoaderIcon";
import { SlideTransition } from "../../components/Transition/SlideTransition";
import CustomPagination from "../../components/Pagination/CustomPagination";
import CustomLoader from "../../components/Loader/CustomLoader";
import ApiLogsFilters from "../../components/LogsManagement/ApiLogsFilters";

const today = new Date();
const calculateDateBefore1Month = today.setMonth(today.getMonth() - 1);
const datePrior1Month = dayjs(calculateDateBefore1Month);

const ApiLogs: React.FC = () => {
  const role = secureLocalStorage.getItem("role");
  const apiLogsState: any = useAppSelector(getLogsData);
  const [apiLogModal, setApiLogModal] = useState<boolean>(false);
  const [selectedLogId, setSelectedLogId] = useState<number | null>(null);
  const itemsPerPageOptions: number[] = ITEMS_PER_PAGE_OPTIONS;
  const [itemsPerPage, setItemsPerPage] = useState<number>(PAGE_LIMIT);
  const [limit, setLimit] = useState<number>(apiLogsState.limit);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const darkMode = useAppSelector(selectDarkMode);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filterApiLogs, setFilterApiLogs] = useState<string>("all");
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
    apiLogsState.totalRecords / apiLogsState.limit
  );
  let startIndex: number = (currentPage - 1) * itemsPerPage;
  let endIndex: number = Math.min(
    startIndex + itemsPerPage,
    apiLogsState.apiLogs.length
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  if (endIndex - startIndex < itemsPerPage) {
    startIndex = Math.max(0, apiLogsState.apiLogs.length - itemsPerPage);
    endIndex = apiLogsState.apiLogs.length;
  }

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const sortedItems = [...apiLogsState.apiLogs].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.id - b.id;
    } else {
      return b.id - a.id;
    }
  });

  const displayedApiLogs = sortedItems.slice(startIndex, endIndex);
  const apiLogData = apiLogsState?.apiLog;

  useEffect(() => {
    const fetchApiLogs = async () => {
      if (role === SUPER_ADMIN) {
        await dispatch(
          fetchAllApiLogs({
            limit: PAGE_LIMIT,
            page: currentPage,
            ...(startDate !== null && {
              start_date: dayjs(startDate).format("YYYY-MM-DD"),
            }),
            ...(endDate !== null && {
              end_date: dayjs(endDate).format("YYYY-MM-DD"),
            }),
          })
        );
      } else {
        navigate("/unauthorized");
      }
    };
    fetchApiLogs();
  }, []);

  useEffect(() => {
    const fetchApiLogData = async () => {
      if (apiLogModal) {
        try {
          setIsLoading(true);
          await dispatch(fetchSingleApiLog(Number(selectedLogId)));
        } catch (error) {
          console.log("Err--", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchApiLogData();
  }, [apiLogModal]);

  const searchDataInApiLogs = async () => {
    try {
      setIsSearchLoading(true);
      const newLimit = itemsPerPage;
      setItemsPerPage(newLimit);
      setLimit(newLimit);
      await dispatch(
        fetchAllApiLogs({
          limit: PAGE_LIMIT,
          page: currentPage,
          ...(startDate !== null && {
            start_date: dayjs(startDate).format("YYYY-MM-DD"),
          }),
          ...(endDate !== null && {
            end_date: dayjs(endDate).format("YYYY-MM-DD"),
          }),
          ...(filterApiLogs !== "all" && {
            status: filterApiLogs === "success" ? SUCCESS_TEXT : ERROR_TEXT,
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
    setFilterApiLogs("all");
    setStartDate(datePrior1Month);
    setEndDate(new Date().toString());
    setItemsPerPage(PAGE_LIMIT);
    setLimit(PAGE_LIMIT);
    try {
      setIsResetLoading(true);
      await dispatch(
        fetchAllApiLogs({
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

  const changeApiLogsStatus = (selectedValue: string) => {
    setFilterApiLogs(selectedValue);
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
        fetchAllApiLogs({
          limit,
          page: pageNumber,
          ...(filterApiLogs !== "all" && {
            status: filterApiLogs === "success" ? SUCCESS_TEXT : ERROR_TEXT,
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
      fetchAllApiLogs({
        limit: newItemsPerPage,
        page: 1,
        ...(filterApiLogs !== "all" && {
          status: filterApiLogs === "success" ? SUCCESS_TEXT : ERROR_TEXT,
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

  const openApiLogModal = (id: number) => {
    setSelectedLogId(id);
    setApiLogModal(true);
  };

  return (
    <>
      {role === SUPER_ADMIN && (
        <>
          <ApiLogsFilters
            changeApiLogsStatus={changeApiLogsStatus}
            control={control}
            darkMode={darkMode}
            filterApiLogs={filterApiLogs}
            endDate={endDate}
            startDate={startDate}
            isSearchLoading={isSearchLoading}
            searchDataInApiLogs={searchDataInApiLogs}
            filterByLogsEndDate={filterByLogsEndDate}
            filterByLogsStartDate={filterByLogsStartDate}
            isResetLoading={isResetLoading}
            resetFilter={resetFilter}
          />

          <div className="mt-3">
            {/* BEGIN: Data List */}
            {apiLogsState.loading ? (
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
                              icon={
                                sortOrder === "asc" ? "ArrowDown" : "ArrowUp"
                              }
                              className={`w-4 h-4 transform transition ease-in duration-500`}
                            ></Lucide>
                          </span>
                        </Table.Th>
                        <Table.Th className="border-b-0 whitespace-nowrap">
                          Method
                        </Table.Th>
                        <Table.Th className="border-b-0 whitespace-nowrap">
                          URL
                        </Table.Th>
                        <Table.Th className="border-b-0 whitespace-nowrap">
                          Status Code
                        </Table.Th>
                        <Table.Th className="border-b-0 whitespace-nowrap">
                          Status
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
                      {apiLogsState.apiLogs.length !== 0 &&
                        displayedApiLogs.map((apiLog: any) => (
                          <Table.Tr key={apiLog.id} className="intro-x">
                            <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                              <span>{apiLog.id}</span>
                            </Table.Td>
                            <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                              <div>
                                {apiLog?.method ? apiLog.method : "N/A"}
                              </div>
                            </Table.Td>
                            <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                              <div className="w-[300px] break-all">
                                {apiLog?.url ? apiLog.url : "N/A"}
                              </div>
                            </Table.Td>
                            <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                              <div>
                                {apiLog?.status_code
                                  ? apiLog.status_code
                                  : "N/A"}
                              </div>
                            </Table.Td>
                            <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                              <div
                                className={clsx({
                                  "flex items-center": true,
                                  "text-success dark:text-green-500":
                                    apiLog.status === SUCCESS_TEXT,
                                  "text-danger dark:text-red-500":
                                    apiLog.status === ERROR_TEXT,
                                })}
                              >
                                {apiLog?.status ? apiLog.status : "N/A"}
                              </div>
                            </Table.Td>
                            <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                              <div className="flex items-center">
                                {apiLog?.created_at
                                  ? moment(apiLog.created_at).format(
                                      DATE_TIME_FORMAT
                                    )
                                  : "N/A"}
                              </div>
                            </Table.Td>
                            <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                              <div>
                                {apiLog?.message ? apiLog.message : "N/A"}
                              </div>
                            </Table.Td>
                            <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                              <div className="flex items-center gap-3">
                                <span
                                  className="flex items-center cursor-pointer"
                                  onClick={() => openApiLogModal(apiLog.id)}
                                >
                                  <Lucide
                                    icon="Eye"
                                    className="w-4 h-4 text-blue-600 dark:text-blue-400"
                                  />
                                </span>
                              </div>
                            </Table.Td>
                          </Table.Tr>
                        ))}
                    </Table.Tbody>
                  </Table>
                </div>
                {apiLogsState.apiLogs.length === 0 && (
                  <h1
                    className={`text-center mt-10 text-xl sm:text-2xl font-medium ${
                      apiLogsState.loading ? "text-inherit" : "text-[#8b8a8a]"
                    }`}
                  >
                    No data to display...
                  </h1>
                )}
                {/* END: Data List */}
                {/* BEGIN: Pagination */}
                {/* {apiLogsState.apiLogs.length > 0 && ( */}
                <CustomPagination
                  currentPage={currentPage}
                  darkMode={darkMode}
                  handleItemsPerPageChange={handleItemsPerPageChange}
                  handlePageChange={handlePageChange}
                  itemsPerPage={itemsPerPage}
                  itemsPerPageOptions={itemsPerPageOptions}
                  totalPages={totalPages}
                  totalRecords={apiLogsState.totalRecords}
                />
                {/* )} */}
                {/* END: Pagination */}
              </>
            )}
          </div>

          <Dialog
            open={apiLogModal}
            onClose={() => setApiLogModal(false)}
            maxWidth="md"
            fullWidth
            TransitionComponent={SlideTransition}
            TransitionProps={{
              timeout: {
                enter: 700,
                exit: 500,
              },
            }}
            key={`apiLog`}
          >
            {apiLogData === null || isLoading ? (
              <DialogContent>
                <LoaderIcon icon="oval" />
              </DialogContent>
            ) : (
              <DialogContent>
                <div className="px-3 pt-3 text-center flex justify-between">
                  <div className="text-xl sm:text-2xl font-medium">
                    API Log Details
                  </div>
                  <Lucide
                    icon="X"
                    className="cursor-pointer hover:text-white hover:bg-slate-500 -mt-3 -mr-2 hover:rounded-full p-1 w-[1.8rem] h-[1.8rem]"
                    onClick={() => setApiLogModal(false)}
                  />
                </div>
                <div className="h-5 border-b-2 dark:border-slate-200"></div>
                <div className="mt-4 px-3 overflow-y-auto max-h-[350px] text-xs sm:text-sm">
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-2">
                      <strong>URL</strong>
                    </div>
                    <div className="col-span-1">:</div>
                    <div className="col-span-9 info">{apiLogData.url}</div>
                  </div>
                  <div className="grid grid-cols-12 gap-4 mt-2">
                    <div className="col-span-2">
                      <strong>Log Time</strong>
                    </div>
                    <div className="col-span-1">:</div>
                    <div className="col-span-9 info">
                      {moment(apiLogData.created_at).format(DATE_TIME_FORMAT)}
                    </div>
                  </div>
                  <h5 className="mt-6 mb-2">Request Headers:</h5>
                  <div className="box dark:border-slate-200 dark:bg-white p-4 rounded-lg">
                    <div className="overflow-y-auto">
                      <pre className="whitespace-pre-wrap dark:text-gray-300">
                        {apiLogData?.request_headers
                          ? apiLogData.request_headers
                          : "--"}
                      </pre>
                    </div>
                  </div>
                  <h5 className="mt-4 mb-2">Request Body:</h5>
                  <div className="box dark:border-slate-200 dark:bg-white p-4 rounded-lg">
                    <div className="overflow-y-auto">
                      <pre className="whitespace-pre-wrap dark:text-gray-300">
                        {apiLogData?.request_body
                          ? apiLogData.request_body
                          : "--"}
                      </pre>
                    </div>
                  </div>
                  <h5 className="mt-4 mb-2">
                    {apiLogData?.status === ERROR_TEXT
                      ? ERROR_TEXT
                      : "Response Body"}
                  </h5>
                  <div className="box dark:border-slate-200 dark:bg-white p-4 rounded-lg">
                    <div className="overflow-y-auto">
                      <pre className="whitespace-pre-wrap dark:text-gray-300">
                        {apiLogData?.response_body
                          ? apiLogData.response_body
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
                      setApiLogModal(false);
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

export default ApiLogs;
