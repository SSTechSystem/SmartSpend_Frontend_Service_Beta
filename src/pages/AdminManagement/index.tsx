import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import Lucide from "../../base-components/Lucide";
import { FormInput } from "../../base-components/Form";
import Table from "../../base-components/Table";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import { selectDarkMode } from "../../stores/darkModeSlice";
import {
  fetchAllAdminData,
  getAdminData,
  deleteAdmin,
} from "../../stores/admin";
import CustomLoader from "../../components/Loader/CustomLoader";
import {
  ITEMS_PER_PAGE_OPTIONS,
  PAGE_LIMIT,
  SUCCESS_CODE,
} from "../../utils/constants";
import CancelSearchText from "../../components/HelperButton/CancelSearchText";
import ResetOrSearchButton from "../../components/HelperButton";
import CustomPagination from "../../components/Pagination/CustomPagination";
import moment from "moment";
import Button from "../../base-components/Button";
import { Dialog } from "../../base-components/Headless";
import { toast } from "react-toastify";
import LoadingIcon from "../../base-components/LoadingIcon";
import { useNavigate } from "react-router-dom";

const index: React.FC = () => {
  const adminState: any = useAppSelector(getAdminData);
  const itemsPerPageOptions: number[] = ITEMS_PER_PAGE_OPTIONS;
  const [itemsPerPage, setItemsPerPage] = useState<number>(PAGE_LIMIT);
  const [limit, setLimit] = useState<number>(adminState.limit);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [deleteAdminModal, setDeleteAdminModal] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedAdminId, setSelectedAdminId] = useState<number | null>(null);
  const deleteButtonRef = useRef(null);
  const navigate = useNavigate();

  const totalPages: number = Math.ceil(
    adminState.totalRecords / adminState.limit
  );
  let startIndex: number = (currentPage - 1) * itemsPerPage;
  let endIndex: number = Math.min(
    startIndex + itemsPerPage,
    adminState.admins.length
  );

  const darkMode = useAppSelector(selectDarkMode);
  const dispatch = useAppDispatch();
  const [searchText, setSearchText] = useState<string>("");

  if (endIndex - startIndex < itemsPerPage) {
    startIndex = Math.max(0, adminState.admins.length - itemsPerPage);
    endIndex = adminState.admins.length;
  }

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const sortedItems = [...adminState.admins].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.id - b.id;
    } else {
      return b.id - a.id;
    }
  });

  const displayedUser = sortedItems.slice(startIndex, endIndex);

  useEffect(() => {
    const fetchAdmin = async () => {
      await dispatch(
        fetchAllAdminData({
          limit: PAGE_LIMIT,
          page: currentPage,
          searchText,
        })
      );
    };
    fetchAdmin();
  }, []);

  const handleSearchAndFilter = async () => {
    try {
      setIsSearchLoading(true);
      const newLimit = itemsPerPage;
      setItemsPerPage(newLimit);
      setLimit(newLimit);
      await dispatch(
        fetchAllAdminData({
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
        fetchAllAdminData({
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
        fetchAllAdminData({
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
      fetchAllAdminData({
        limit: newItemsPerPage,
        page: 1,
        searchText,
      })
    );
    setCurrentPage(1);
  };

  const deleteSelectedAdmin = async () => {
    try {
      setIsLoading(true);
      const res = await dispatch(deleteAdmin(Number(selectedAdminId)));
      if (res.payload?.status === SUCCESS_CODE) {
        dispatch(fetchAllAdminData({ limit, page: 1, searchText: "" }));
        toast.success(res.payload.data.message || "Admin deleted successfully");
        setSearchText("");
        setCurrentPage(1);
        setDeleteAdminModal(false);
      } else {
        toast.error(
          res.payload.response.data.message || "Something went wrong"
        );
      }
    } catch (error) {
      console.log("Err-", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateAdmin = (id: number) => {
    navigate(`/manage-admin/${id}`);
  };

  const openDeleteAdminModal = (id: number) => {
    setSelectedAdminId(id);
    setDeleteAdminModal(true);
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
                placeholder="Search by admin name, email, phone number"
                onChange={(e) => setSearchText(e.target.value)}
                value={searchText}
                name="AdminSearch"
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
            <Button
              variant="primary" 
              onClick={() => navigate("/manage-admin")}
              className="w-max"
            >
              <Lucide icon="PlusCircle" className="w-4 h-4 mr-2" />
              Add Admin Details
            </Button>
          </div>
        </div>

        <div className="mt-3">
          {/* BEGIN: Data List */}
          {adminState.loading ? (
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
                        User Email
                      </Table.Th>
                      <Table.Th className="border-b-0 whitespace-nowrap">
                        Phone
                      </Table.Th>
                      <Table.Th className="border-b-0 whitespace-nowrap">
                        Last Login
                      </Table.Th>
                      <Table.Th className="border-b-0 whitespace-nowrap">
                        Created At
                      </Table.Th>
                      <Table.Th className="border-b-0 whitespace-nowrap">
                        Status
                      </Table.Th>
                      <Table.Th className="border-b-0 whitespace-nowrap">
                        Action
                      </Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {displayedUser.map((admin: any, idx: number) => {
                      const rowIndex =
                        (currentPage - 1) * itemsPerPage + idx + 1;
                      return (
                        <Table.Tr key={admin.id} className="intro-x">
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-4">
                            <span>{rowIndex}</span>
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-4 capitalize">
                            {admin.name ? admin.name : "-"}
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-4">
                            <div className="w-[150px] break-words">
                              {admin.email ? admin.email : "-"}
                            </div>
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-4 capitalize">
                            {admin.phone ? admin.phone : "-"}
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                            <div className="flex items-center">
                              {admin.last_login
                                ? moment(admin.last_login).format(
                                    "DD-MM-YYYY hh:mm:ss"
                                  )
                                : "-"}
                            </div>
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                            <div className="flex items-center">
                              {admin.created_at
                                ? moment(admin.created_at).format(
                                    "DD-MM-YYYY hh:mm:ss"
                                  )
                                : "-"}
                            </div>
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                            <div className="flex items-center">
                              {admin.enable === 1 ? (
                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-semibold text-xs">
                                  Enabled
                                </span>
                              ) : (
                                <span className="bg-red-100 text-red-700 px-2 py-1 rounded font-semibold text-xs">
                                  Disabled
                                </span>
                              )}
                            </div>
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                            <div className="flex items-center gap-2">
                              <span
                                className="flex items-center cursor-pointer"
                                onClick={() => updateAdmin(admin.id)}
                              >
                                <Lucide
                                  icon="Edit"
                                  className="w-4 h-4 text-blue-600 dark:text-blue-400"
                                />
                              </span>
                              <span
                                className="flex items-center cursor-pointer"
                                onClick={() => openDeleteAdminModal(admin.id)}
                              >
                                <Lucide
                                  icon="Trash2"
                                  className="w-4 h-4 text-red-600 dark:text-red-500"
                                />
                              </span>
                            </div>
                          </Table.Td>
                        </Table.Tr>
                      );
                    })}
                  </Table.Tbody>
                </Table>
              </div>
              {adminState.admins.length === 0 && (
                <h1
                  className={`text-center mt-10 text-xl sm:text-2xl font-medium ${
                    adminState.loading ? "text-inherit" : "text-[#8b8a8a]"
                  }`}
                >
                  No data to display...
                </h1>
              )}
              {/* END: Data List */}
              {/* BEGIN: Pagination */}
              {/* {adminState.admins.length > 0 && ( */}
              <CustomPagination
                currentPage={currentPage}
                darkMode={darkMode}
                handleItemsPerPageChange={handleItemsPerPageChange}
                handlePageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                itemsPerPageOptions={itemsPerPageOptions}
                totalPages={totalPages}
                totalRecords={adminState.totalRecords}
              />
              {/* )} */}
              {/* END: Pagination */}
            </>
          )}
        </div>

        {/* BEGIN: Delete Confirmation Modal */}
        <Dialog
          open={deleteAdminModal}
          onClose={() => {
            setDeleteAdminModal(false);
          }}
          initialFocus={deleteButtonRef}
        >
          <Dialog.Panel>
            <div className="p-5 text-center">
              <div className="mt-5 text-lg sm:text-xl">
                Are you sure to delete this admin?
              </div>
            </div>
            <div className="px-5 pb-8 text-center flex justify-end gap-5">
              <Button
                variant="outline-secondary"
                type="button"
                onClick={() => {
                  setDeleteAdminModal(false);
                }}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                type="button"
                ref={deleteButtonRef}
                onClick={deleteSelectedAdmin}
                disabled={isLoading}
                className="text-xs"
              >
                {isLoading ? (
                  <>
                    Loading...
                    <LoadingIcon
                      icon="oval"
                      color="white"
                      className="w-4 h-4 ml-2"
                    />
                  </>
                ) : (
                  "Delete Admin"
                )}
              </Button>
            </div>
          </Dialog.Panel>
        </Dialog>
        {/* END: Delete Confirmation Modal */}
      </div>
    </>
  );
};

export default index;
