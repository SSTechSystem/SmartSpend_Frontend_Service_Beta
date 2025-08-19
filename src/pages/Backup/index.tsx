import React, { ChangeEvent, useEffect, useState } from "react";
import Lucide from "../../base-components/Lucide";
import { useForm } from "react-hook-form";
import { FormInput } from "../../base-components/Form";
import Table from "../../base-components/Table";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import { selectDarkMode } from "../../stores/darkModeSlice";
import { fetchAllBackupData, getBackupData } from "../../stores/backup";
import CustomLoader from "../../components/Loader/CustomLoader";
import {
  ITEMS_PER_PAGE_OPTIONS,
  PAGE_LIMIT,
} from "../../utils/constants";
import CancelSearchText from "../../components/HelperButton/CancelSearchText";
import ResetOrSearchButton from "../../components/HelperButton";
import CustomPagination from "../../components/Pagination/CustomPagination";
import moment from "moment";

const index: React.FC = () => {
  const backupState: any = useAppSelector(getBackupData);
  const itemsPerPageOptions: number[] = ITEMS_PER_PAGE_OPTIONS;
  const [itemsPerPage, setItemsPerPage] = useState<number>(PAGE_LIMIT);
  const [limit, setLimit] = useState<number>(backupState.limit);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const totalPages: number = Math.ceil(
    backupState.totalRecords / backupState.limit
  );
  let startIndex: number = (currentPage - 1) * itemsPerPage;
  let endIndex: number = Math.min(
    startIndex + itemsPerPage,
    backupState.backups.length
  );

  const darkMode = useAppSelector(selectDarkMode);
  const dispatch = useAppDispatch();
  const [searchText, setSearchText] = useState<string>("");

  if (endIndex - startIndex < itemsPerPage) {
    startIndex = Math.max(0, backupState.backups.length - itemsPerPage);
    endIndex = backupState.backups.length;
  }

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const sortedItems = [...backupState.backups].sort((a, b) => {
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
        fetchAllBackupData({
          limit: PAGE_LIMIT,
          page: currentPage,
          searchText,
        })
      );
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
        fetchAllBackupData({
          limit,
          page: 1,
          searchText,
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
    setItemsPerPage(PAGE_LIMIT);
    setLimit(PAGE_LIMIT);
    try {
      setIsResetLoading(true);
      await dispatch(
        fetchAllBackupData({
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

  const handlePageChange = async (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      await dispatch(
        fetchAllBackupData({
          limit,
          page: pageNumber,
          searchText,
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
      fetchAllBackupData({
        limit: newItemsPerPage,
        page: 1,
        searchText,
      })
    );
    setCurrentPage(1);
  };

  return (
    <>
      <div className="py-2">
        <div className="grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-3 sm:mt-5 justify-end sm:justify-end flex sm:flex-row flex-col items-end">
          {/* Search */}
          <div className="w-full sm:order-2 order-1 sm:ml-auto">
            <div className="relative text-slate-500">
              <FormInput
                type="text"
                className="dark:text-gray-300"
                placeholder="Search by user name, email, backup filename"
                onChange={(e) => setSearchText(e.target.value)}
                value={searchText}
                name="UserSearch"
              />
              {searchText && <CancelSearchText setSearchText={setSearchText} />}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2 sm:order-3 order-2 sm:ml-2">
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
          {backupState.loading ? (
            <CustomLoader color="fill-orange-600" />
          ) : (
            <>
              <div className="col-span-12 overflow-hidden intro-y">
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
                        User Name
                      </Table.Th>
                      <Table.Th className="border-b-0 whitespace-nowrap">
                        Email
                      </Table.Th>
                      <Table.Th className="border-b-0 whitespace-nowrap">
                        BackupFileName
                      </Table.Th>
                      <Table.Th className="border-b-0 whitespace-nowrap w-[100px]">
                        Created At
                      </Table.Th>
                      <Table.Th className="border-b-0 whitespace-nowrap w-[20px]">
                        Updated At
                      </Table.Th>
                      <Table.Th className="border-b-0 whitespace-nowrap">
                        Enable
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {displayedUser.map((backup: any) => (
                      <Table.Tr key={backup.id} className="intro-x">
                        <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-4">
                          <span>{backup.id}</span>
                        </Table.Td>
                        <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-4 capitalize">
                          {backup.user.name ? backup.user.name : "-"}
                        </Table.Td>
                        <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-4">
                          <div className="w-[150px] break-words">
                            {backup.user.email ? backup.user.email : "-"}
                          </div>
                        </Table.Td>
                        <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-4 capitalize">
                          {backup.backup_file_name
                            ? backup.backup_file_name
                            : "-"}
                        </Table.Td>
                        <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                          <div className="flex items-center">
                            {backup.created_at
                              ? moment(backup.created_at).format(
                                  "DD-MM-YYYY hh:mm:ss"
                                )
                              : "-"}
                          </div>
                        </Table.Td>
                        <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                          <div className="flex items-center">
                            {backup.updated_at
                              ? moment(backup.updated_at).format(
                                  "DD-MM-YYYY hh:mm:ss"
                                )
                              : "-"}
                          </div>
                        </Table.Td>
                        <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                          <div className="flex items-center w-[20px]">
                            {backup.enable === 1 ? (
                              <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-semibold text-xs">
                                Yes
                              </span>
                            ) : (
                              <span className="bg-red-100 text-red-700 px-2 py-1 rounded font-semibold text-xs">
                                No
                              </span>
                            )}
                          </div>
                        </Table.Td>
                        
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              </div>
              {backupState.backups.length === 0 && (
                <h1
                  className={`text-center mt-10 text-xl sm:text-2xl font-medium ${
                    backupState.loading ? "text-inherit" : "text-[#8b8a8a]"
                  }`}
                >
                  No data to display...
                </h1>
              )}
              {/* END: Data List */}
              {/* BEGIN: Pagination */}
              {/* {backupState.backups.length > 0 && ( */}
              <CustomPagination
                currentPage={currentPage}
                darkMode={darkMode}
                handleItemsPerPageChange={handleItemsPerPageChange}
                handlePageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                itemsPerPageOptions={itemsPerPageOptions}
                totalPages={totalPages}
                totalRecords={backupState.totalRecords}
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
