import React, { ChangeEvent, useState, useEffect, useRef } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import Button from "../../base-components/Button";
import { useNavigate } from "react-router-dom";
import Lucide from "../../base-components/Lucide";
import Table from "../../base-components/Table";
import Tippy from "../../base-components/Tippy";
import { FormInput, FormSwitch } from "../../base-components/Form";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import { selectDarkMode } from "../../stores/darkModeSlice";
import {
  changeAccountStatus,
  deleteAccount,
  fetchAllAccountsData,
  getAccountsData,
} from "../../stores/accounts";
import moment from "moment";
import { Dialog } from "../../base-components/Headless";
import LoadingIcon from "../../base-components/LoadingIcon";
import { toast } from "react-toastify";
import { checkPermission } from "../../utils/checkPermissions";
import CustomLoader from "../../components/Loader/CustomLoader";
import {
  DATE_TIME_FORMAT,
  ITEMS_PER_PAGE_OPTIONS,
  PAGE_LIMIT,
  SUCCESS_CODE,
  SUPER_ADMIN,
} from "../../utils/constants";
import { openImageInNewTab } from "../../utils/helper";
import CancelSearchText from "../../components/HelperButton/CancelSearchText";
import secureLocalStorage from "react-secure-storage";
import ResetOrSearchButton from "../../components/HelperButton";
import clsx from "clsx";
import ActivateModal from "../../components/HelperModal/ActivateModal";
import CustomPagination from "../../components/Pagination/CustomPagination";

const filterList = [
  { label: "Active", value: "active" },
  { label: "Deactive", value: "deactive" },
  { label: "All", value: "all" },
];

const index: React.FC = () => {
  const role = secureLocalStorage.getItem("role");
  const accountsState: any = useAppSelector(getAccountsData);
  const itemsPerPageOptions: number[] = ITEMS_PER_PAGE_OPTIONS;
  const [itemsPerPage, setItemsPerPage] = useState<number>(PAGE_LIMIT);
  const [limit, setLimit] = useState<number>(accountsState.limit);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [deleteAccountsModal, setDeleteAccountsModal] = useState(false);
  const [selectedAccountsId, setSelectedAccountsId] = useState<number | null>(
    null
  );
  const [activateAccountModal, setActivateAccountModal] = useState(false);
  const [isAccountChecked, setIsAccountChecked] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterAccount, setFilterAccount] = useState<string>("all");

  const totalPages: number = Math.ceil(
    accountsState.totalRecords / accountsState.limit
  );
  let startIndex: number = (currentPage - 1) * itemsPerPage;
  let endIndex: number = Math.min(
    startIndex + itemsPerPage,
    accountsState.accounts.length
  );

  const navigate = useNavigate();
  const darkMode = useAppSelector(selectDarkMode);
  const dispatch = useAppDispatch();
  const [searchText, setSearchText] = useState<string>("");
  const deleteButtonRef = useRef(null);
  const activateBtnRef = useRef(null);
  const [hasViewPermission, setHasViewPermission] = useState<boolean>(false);
  const [hasAddPermission, setHasAddPermission] = useState<boolean>(false);
  const [hasEditPermission, setHasEditPermission] = useState<boolean>(false);
  const [hasDeletePermission, setHasDeletePermission] =
    useState<boolean>(false);

  if (endIndex - startIndex < itemsPerPage) {
    startIndex = Math.max(0, accountsState.accounts.length - itemsPerPage);
    endIndex = accountsState.accounts.length;
  }

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const sortedItems = [...accountsState.accounts].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.id - b.id;
    } else {
      return b.id - a.id;
    }
  });

  const displayedAccounts = sortedItems.slice(startIndex, endIndex);

  useEffect(() => {
    const fetchAccounts = async () => {
      const doesHaveViewPermission = await checkPermission(
        "account_management",
        "view"
      );
      const doesHaveAddPermission = await checkPermission(
        "account_management",
        "add"
      );
      const doesHaveDeletePermission = await checkPermission(
        "account_management",
        "delete"
      );
      const doesHaveEditPermission = await checkPermission(
        "account_management",
        "edit"
      );
      setHasViewPermission(doesHaveViewPermission);
      setHasAddPermission(doesHaveAddPermission);
      setHasEditPermission(doesHaveEditPermission);
      setHasDeletePermission(doesHaveDeletePermission);
      if (doesHaveViewPermission || role === SUPER_ADMIN) {
        await dispatch(
          fetchAllAccountsData({
            limit: PAGE_LIMIT,
            page: currentPage,
            searchText,
            ...(filterAccount !== "all" && {
              status: filterAccount === "active" ? 1 : 0,
            }),
          })
        );
      } else {
        navigate("/unauthorized");
      }
    };
    fetchAccounts();
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
        fetchAllAccountsData({
          limit,
          page: 1,
          searchText,
          ...(filterAccount !== "all" && {
            status: filterAccount === "active" ? 1 : 0,
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
    setFilterAccount("all");
    setItemsPerPage(PAGE_LIMIT);
    setLimit(PAGE_LIMIT);
    try {
      setIsResetLoading(true);
      await dispatch(
        fetchAllAccountsData({
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

  const changeStatus = (
    e: ChangeEvent<HTMLInputElement>,
    accountId: number
  ) => {
    const { checked } = e.target;
    setActivateAccountModal(true);
    setSelectedAccountsId(accountId);
    setIsAccountChecked(checked);
  };

  const handlePageChange = async (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      await dispatch(
        fetchAllAccountsData({
          limit,
          page: pageNumber,
          searchText,
          ...(filterAccount !== "all" && {
            status: filterAccount === "active" ? 1 : 0,
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
      fetchAllAccountsData({
        limit: newItemsPerPage,
        page: 1,
        searchText,
        ...(filterAccount !== "all" && {
          status: filterAccount === "active" ? 1 : 0,
        }),
      })
    );
    setCurrentPage(1);
  };

  const openDeleteAccountModal = (id: number) => {
    setSelectedAccountsId(id);
    setDeleteAccountsModal(true);
  };

  const activateSelectedAccount = async () => {
    try {
      setIsLoading(true);
      const res = await dispatch(
        changeAccountStatus({
          status: isAccountChecked ? 1 : 0,
          id: Number(selectedAccountsId),
        })
      );
      if (res.payload?.status === SUCCESS_CODE) {
        toast.success(
          res.payload.data?.message || "Status updated successfully"
        );
        await dispatch(
          fetchAllAccountsData({
            limit,
            page: 1,
            searchText: "",
          })
        );
        setFilterAccount("all");
        setSearchText("");
        setCurrentPage(1);
        setActivateAccountModal(false);
      } else {
        toast.error(
          res.payload?.response?.data?.message || "Something went wrong"
        );
      }
    } catch (error) {
      console.log("Err--", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSelectedAccount = async () => {
    try {
      setIsLoading(true);
      const res = await dispatch(deleteAccount(Number(selectedAccountsId)));
      if (res.payload?.status === SUCCESS_CODE) {
        dispatch(fetchAllAccountsData({ limit, page: 1, searchText: "" }));
        toast.success(
          res.payload.data?.message || "Account deleted successfully"
        );
        setFilterAccount("all");
        setSearchText("");
        setCurrentPage(1);
        setDeleteAccountsModal(false);
      } else {
        return toast.error(
          res.payload?.response?.data?.message || "Something went wrong"
        );
      }
    } catch (error) {
      console.log("Err-", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateAccount = (id: number) => {
    secureLocalStorage.setItem("newlyAddedAccounts", String(id));
    navigate("/accounts/manage-accounts");
  };

  return (
    <>
      {(hasViewPermission || role === SUPER_ADMIN) && (
        <div>
          <div className="flex px-2 flex-wrap gap-3 sm:gap-5 mt-3 sm:mt-5">
            <div className="w-full sm:w-40">
              <Controller
                name="accountStatus"
                control={control}
                render={({ field: { value } }) => {
                  const selectedState: any = filterList?.find(
                    (option) => option.value === value
                  );
                  const selectedVal = filterList?.find(
                    (option) => option.value === filterAccount
                  );
                  const defaultValue =
                    (selectedState === undefined
                      ? selectedVal
                      : selectedState) || null;
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
                          setFilterAccount(newVal?.value);
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
            <div className="w-full sm:flex-1">
              <div className="relative text-slate-500">
                <FormInput
                  type="text"
                  className="pr-10 !box dark:text-gray-300"
                  placeholder={`Search by account name${
                    role === SUPER_ADMIN ? " or company name" : ""
                  }...`}
                  onChange={(e) => setSearchText(e.target.value)}
                  value={searchText}
                  name="AccountSearch"
                />
                {searchText && (
                  <CancelSearchText setSearchText={setSearchText} />
                )}
                {/* <Lucide
                  icon="Search"
                  className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3"
                /> */}
              </div>
            </div>
            <ResetOrSearchButton
              type="search"
              disabled={isSearchLoading}
              onClick={handleSearchAndFilter}
            />

            <ResetOrSearchButton
              disabled={isResetLoading}
              onClick={resetFilter}
              type="reset"
            />

            {(hasAddPermission || role === SUPER_ADMIN) && (
              <Button
                variant="primary"
                className="mb-2 mr-2 text-xs py-[0.3rem]"
                onClick={() => navigate("/accounts/manage-accounts")}
              >
                <Lucide icon="PlusCircle" className="mr-2 w-5" /> Add Accounts
              </Button>
            )}
          </div>

          <div className="mt-3">
            {/* BEGIN: Data List */}
            {accountsState.loading ? (
              <CustomLoader color="fill-green-600" />
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
                          Logo
                        </Table.Th>
                        <Table.Th className="border-b-0 whitespace-nowrap">
                          Account Code
                        </Table.Th>
                        <Table.Th className="border-b-0 whitespace-nowrap">
                          Account Name
                        </Table.Th>
                        <Table.Th className="border-b-0 whitespace-nowrap">
                          Company Name
                        </Table.Th>
                        <Table.Th className="border-b-0 whitespace-nowrap">
                          Last Update
                        </Table.Th>
                        <Table.Th className="border-b-0 whitespace-nowrap">
                          Status
                        </Table.Th>
                        {(hasEditPermission ||
                          hasDeletePermission ||
                          role === SUPER_ADMIN) && (
                          <Table.Th className="border-b-0 whitespace-nowrap">
                            Action
                          </Table.Th>
                        )}
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {accountsState.accounts.length !== 0 &&
                        displayedAccounts.map((account: any) => (
                          <Table.Tr key={account.id} className="intro-x">
                            <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                              <span>{account.id}</span>
                            </Table.Td>
                            <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                              <div className="flex -ml-[0.35rem]">
                                <div className="w-7 h-7 image-fit zoom-in">
                                  <Tippy
                                    as="img"
                                    alt={account.name.slice(0, 10) + "..."}
                                    className="rounded-full shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
                                    src={
                                      account.logo !== ""
                                        ? `${
                                            import.meta.env
                                              .VITE_REACT_APP_ACCOUNT_IMAGE_URL
                                          }/${account.logo}`
                                        : `/sskit/user.png`
                                    }
                                    onClick={() => {
                                      if (account.logo) {
                                        openImageInNewTab(
                                          `${
                                            import.meta.env
                                              .VITE_REACT_APP_ACCOUNT_IMAGE_URL
                                          }/${account.logo}`
                                        );
                                      }
                                    }}
                                    content={`Uploaded at ${moment(
                                      account.updated_at
                                    ).format(DATE_TIME_FORMAT)}`}
                                  />
                                </div>
                              </div>
                            </Table.Td>
                            <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                              {account.account_code
                                ? account.account_code
                                : "N/A"}
                            </Table.Td>
                            <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                              <div className="capitalize">
                                {account.name ? account.name : "N/A"}
                              </div>
                            </Table.Td>
                            <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                              <div className="capitalize">
                                {account?.company_detail?.name
                                  ? account.company_detail.name
                                  : "N/A"}
                              </div>
                            </Table.Td>
                            <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                              <div className="flex items-center">
                                {moment(account.updated_at).format(
                                  DATE_TIME_FORMAT
                                )}
                              </div>
                            </Table.Td>
                            <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                              <div className="flex items-center">
                                <FormSwitch>
                                  <FormSwitch.Input
                                    id={`checkbox-switch-7${account.id}`}
                                    type="checkbox"
                                    className="shadow-xl border-slate-300"
                                    onChange={(e) =>
                                      changeStatus(e, account.id)
                                    }
                                    checked={
                                      account.status === 1 ? true : false
                                    }
                                  />
                                </FormSwitch>
                              </div>
                            </Table.Td>
                            {(hasEditPermission ||
                              hasDeletePermission ||
                              role === SUPER_ADMIN) && (
                              <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                                <div className="flex items-center gap-2">
                                  {(hasEditPermission ||
                                    role === SUPER_ADMIN) && (
                                    <span
                                      className="flex items-center cursor-pointer"
                                      onClick={() => updateAccount(account.id)}
                                    >
                                      <Lucide
                                        icon="Edit"
                                        className="w-4 h-4 text-blue-600 dark:text-blue-400"
                                      />
                                    </span>
                                  )}

                                  {(hasDeletePermission ||
                                    role === SUPER_ADMIN) && (
                                    <span
                                      className="flex items-center cursor-pointer"
                                      onClick={() =>
                                        openDeleteAccountModal(account.id)
                                      }
                                    >
                                      <Lucide
                                        icon="Trash2"
                                        className="w-4 h-4 text-red-600 dark:text-red-500"
                                      />
                                    </span>
                                  )}
                                </div>
                              </Table.Td>
                            )}
                          </Table.Tr>
                        ))}
                    </Table.Tbody>
                  </Table>
                </div>
                {accountsState.accounts.length === 0 && (
                  <h1
                    className={`text-center mt-10 text-xl sm:text-2xl font-medium ${
                      accountsState.loading ? "text-inherit" : "text-[#8b8a8a]"
                    }`}
                  >
                    No data to display...
                  </h1>
                )}
                {/* END: Data List */}
                {/* BEGIN: Pagination */}
                {/* {accountsState.accounts.length > 0 && ( */}
                <CustomPagination
                  currentPage={currentPage}
                  darkMode={darkMode}
                  handleItemsPerPageChange={handleItemsPerPageChange}
                  handlePageChange={handlePageChange}
                  itemsPerPage={itemsPerPage}
                  itemsPerPageOptions={itemsPerPageOptions}
                  totalPages={totalPages}
                  totalRecords={accountsState.totalRecords}
                />
                {/* )} */}
                {/* END: Pagination */}
              </>
            )}
          </div>

          {/* BEGIN: Delete Confirmation Modal */}
          <Dialog
            open={deleteAccountsModal}
            onClose={() => {
              setDeleteAccountsModal(false);
            }}
            initialFocus={deleteButtonRef}
          >
            <Dialog.Panel>
              <div className="p-5 text-center">
                <div className="mt-5 text-lg sm:text-xl">
                  Are you sure to delete this account?
                </div>
              </div>
              <div className="px-5 pb-8 text-center flex justify-end gap-5">
                <Button
                  variant="outline-secondary"
                  type="button"
                  onClick={() => {
                    setDeleteAccountsModal(false);
                  }}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  type="button"
                  ref={deleteButtonRef}
                  onClick={deleteSelectedAccount}
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
                    "Delete Account"
                  )}
                </Button>
              </div>
            </Dialog.Panel>
          </Dialog>
          {/* END: Delete Confirmation Modal */}

          {/* Activate / Deactivate Modal */}
          <ActivateModal
            checked={isAccountChecked}
            isLoading={isLoading}
            moduleName="account"
            open={activateAccountModal}
            onClose={() => setActivateAccountModal(false)}
            onClick={activateSelectedAccount}
            focusRef={activateBtnRef}
          />
        </div>
      )}
    </>
  );
};

export default index;
