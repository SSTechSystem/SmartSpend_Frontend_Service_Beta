import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";
import { Autocomplete, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { FormInput, FormSwitch } from "../../base-components/Form";
import Table from "../../base-components/Table";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import { selectDarkMode } from "../../stores/darkModeSlice";
import {
  changeUserStatus,
  deleteUser,
  fetchAllUsersData,
  getUsersData,
  sendVerificationEmail,
} from "../../stores/user";
import { toast } from "react-toastify";
import { Dialog } from "../../base-components/Headless";
import LoadingIcon from "../../base-components/LoadingIcon";
import { checkPermission } from "../../utils/checkPermissions";
import moment from "moment";
import Tippy from "../../base-components/Tippy";
import CustomLoader from "../../components/Loader/CustomLoader";
import {
  DATE_TIME_FORMAT,
  ITEMS_PER_PAGE_OPTIONS,
  PAGE_LIMIT,
  SUCCESS_CODE,
  SUPER_ADMIN,
} from "../../utils/constants";
import { capitalizeByCharacter, openImageInNewTab } from "../../utils/helper";
import CancelSearchText from "../../components/HelperButton/CancelSearchText";
import { fetchAllRoles, getRolesData } from "../../stores/manageRole";
import secureLocalStorage from "react-secure-storage";
import ResetOrSearchButton from "../../components/HelperButton";
import clsx from "clsx";
import ActivateModal from "../../components/HelperModal/ActivateModal";
import CustomPagination from "../../components/Pagination/CustomPagination";
import EmailVerificationModal from "../../components/UserManagement/EmailVerificationModal";

const filterList = [
  { label: "Active", value: "active" },
  { label: "Deactive", value: "deactive" },
  { label: "All", value: "all" },
];

const index: React.FC = () => {
  const role = secureLocalStorage.getItem("role");
  const userState: any = useAppSelector(getUsersData);
  const itemsPerPageOptions: number[] = ITEMS_PER_PAGE_OPTIONS;
  const [itemsPerPage, setItemsPerPage] = useState<number>(PAGE_LIMIT);
  const [limit, setLimit] = useState<number>(userState.limit);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [deleteUserModal, setDeleteUserModal] = useState(false);
  const [emailVerificationModal, setEmailVerificationModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [activateUserModal, setActivateUserModal] = useState(false);
  const [isUserChecked, setIsUserChecked] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filterUser, setFilterUser] = useState<string>("all");
  const [filterRole, setFilterRole] = useState<string | number>("");
  const [hasViewPermission, setHasViewPermission] = useState<boolean>(false);
  const [hasAddPermission, setHasAddPermission] = useState<boolean>(false);
  const [hasEditPermission, setHasEditPermission] = useState<boolean>(false);
  const [hasDeletePermission, setHasDeletePermission] =
    useState<boolean>(false);

  const totalPages: number = Math.ceil(
    userState.totalRecords / userState.limit
  );
  let startIndex: number = (currentPage - 1) * itemsPerPage;
  let endIndex: number = Math.min(
    startIndex + itemsPerPage,
    userState.users.length
  );

  const navigate = useNavigate();
  const darkMode = useAppSelector(selectDarkMode);
  const dispatch = useAppDispatch();
  const [searchText, setSearchText] = useState<string>("");
  const deleteButtonRef = useRef(null);
  const activateBtnRef = useRef(null);
  const emailVerificationBtnRef = useRef(null);
  const { roles } = useAppSelector(getRolesData);
  const roleDropdown = roles?.filter((data) => data?.role_name !== SUPER_ADMIN);

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
    const fetchUsers = async () => {
      const doesHaveViewPermission = await checkPermission(
        "user_management",
        "view"
      );
      const doesHaveAddPermission = await checkPermission(
        "user_management",
        "add"
      );
      const doesHaveDeletePermission = await checkPermission(
        "user_management",
        "delete"
      );
      const doesHaveEditPermission = await checkPermission(
        "user_management",
        "edit"
      );
      setHasViewPermission(doesHaveViewPermission);
      setHasAddPermission(doesHaveAddPermission);
      setHasEditPermission(doesHaveEditPermission);
      setHasDeletePermission(doesHaveDeletePermission);
      if (doesHaveViewPermission || role === SUPER_ADMIN) {
        await dispatch(
          fetchAllUsersData({
            limit: PAGE_LIMIT,
            page: currentPage,
            searchText,
            ...(filterUser !== "all" && {
              enable: filterUser === "active" ? 1 : 0,
            }),
            ...(filterRole && {
              role_id: Number(filterRole),
            }),
          })
        );
        dispatch(fetchAllRoles({ type: "fordropdown" }));
      } else {
        navigate("/unauthorized");
      }
    };
    fetchUsers();
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
        fetchAllUsersData({
          limit,
          page: 1,
          searchText,
          ...(filterUser !== "all" && {
            enable: filterUser === "active" ? 1 : 0,
          }),
          ...(filterRole && {
            role_id: Number(filterRole),
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
    setFilterUser("all");
    setFilterRole("");
    setItemsPerPage(PAGE_LIMIT);
    setLimit(PAGE_LIMIT);
    try {
      setIsResetLoading(true);
      await dispatch(
        fetchAllUsersData({
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

  const changeStatus = (e: ChangeEvent<HTMLInputElement>, userId: number) => {
    const { checked } = e.target;
    setActivateUserModal(true);
    setSelectedUserId(userId);
    setIsUserChecked(checked);
  };

  const handlePageChange = async (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      await dispatch(
        fetchAllUsersData({
          limit,
          page: pageNumber,
          searchText,
          ...(filterUser !== "all" && {
            enable: filterUser === "active" ? 1 : 0,
          }),
          ...(filterRole && {
            role_id: Number(filterRole),
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
      fetchAllUsersData({
        limit: newItemsPerPage,
        page: 1,
        searchText,
        ...(filterUser !== "all" && {
          enable: filterUser === "active" ? 1 : 0,
        }),
        ...(filterRole && {
          role_id: Number(filterRole),
        }),
      })
    );
    setCurrentPage(1);
  };

  const openDeleteUserModal = (id: number) => {
    setSelectedUserId(id);
    setDeleteUserModal(true);
  };

  const openVerificationEmailModal = (id: number) => {
    setSelectedUserId(id);
    setEmailVerificationModal(true);
  };

  const activateSelectedUser = async () => {
    try {
      setIsLoading(true);
      const res = await dispatch(
        changeUserStatus({
          enable: isUserChecked ? 1 : 0,
          id: Number(selectedUserId),
        })
      );
      if (res.payload?.status === SUCCESS_CODE) {
        toast.success(
          res.payload.data?.message || "Status updated successfully"
        );
        await dispatch(
          fetchAllUsersData({
            limit,
            page: 1,
            searchText: "",
          })
        );
        setFilterUser("all");
        setFilterRole("");
        setSearchText("");
        setCurrentPage(1);
        setActivateUserModal(false);
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

  const deleteSelectedUser = async () => {
    try {
      setIsLoading(true);
      const res = await dispatch(deleteUser(Number(selectedUserId)));
      if (res.payload?.status === SUCCESS_CODE) {
        toast.success(res.payload.data?.message || "User deleted successfully");
        dispatch(fetchAllUsersData({ limit, page: 1, searchText: "" }));
        setFilterUser("all");
        setFilterRole("");
        setSearchText("");
        setCurrentPage(1);
        setDeleteUserModal(false);
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

  const resendVerificationEmail = async () => {
    try {
      setIsLoading(true);
      const res = await dispatch(
        sendVerificationEmail({ id: Number(selectedUserId) })
      );
      if (res.payload?.status === SUCCESS_CODE) {
        toast.success(
          res.payload.data?.message || "Verification email sent successfully"
        );
        dispatch(fetchAllUsersData({ limit, page: 1, searchText: "" }));
        setFilterUser("all");
        setFilterRole("");
        setSearchText("");
        setCurrentPage(1);
        setEmailVerificationModal(false);
      } else {
        toast.error(
          res.payload?.response?.data?.message || "Something went wrong"
        );
      }
    } catch (error) {
      console.log("Err-", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (id: number) => {
    secureLocalStorage.setItem("newlyAddedUser", String(id));
    navigate("/user/manage-user");
  };
  return (
    <>
      {(hasViewPermission || role === SUPER_ADMIN) && (
        <div>
          <div className="flex px-2 flex-wrap gap-3 sm:gap-5 mt-3 sm:mt-5">
            <div className="flex-1 sm:flex-[0.4]">
              <Controller
                name="userStatus"
                control={control}
                render={({ field: { value } }) => {
                  const selectedState: any = filterList?.find(
                    (option) => option.value === value
                  );
                  const selectedVal = filterList?.find(
                    (option) => option.value === filterUser
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
                          setFilterUser(newVal?.value);
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
            <div className="sm:flex-[0.6] w-full">
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
                    (selectedState === undefined
                      ? selectedVal
                      : selectedState) || null;

                  return (
                    <>
                      <Autocomplete
                        disablePortal
                        size="small"
                        id="combo-box-demo-2"
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
                        value={defaultValue as any}
                        options={roleDropdown?.map((data) => ({
                          value: data.id,
                          label: capitalizeByCharacter(data.role_name, "_"),
                        }))}
                        getOptionLabel={(option) =>
                          option.label ??
                          capitalizeByCharacter(option.role_name, "_")
                        }
                        onChange={(_, newVal) => {
                          filterByRole(newVal?.value);
                        }}
                        isOptionEqualToValue={(option, value) => {
                          return option.value === (value.id ? value.id : null);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Select Role"
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
                  placeholder={`Search by user name${
                    role === SUPER_ADMIN ? ", company name" : ""
                  } or account name...`}
                  onChange={(e) => setSearchText(e.target.value)}
                  value={searchText}
                  name="UserSearch"
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
                onClick={() => navigate("/user/manage-user")}
              >
                <Lucide icon="PlusCircle" className="mr-2 w-5" /> Add New User
              </Button>
            )}
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
                              icon={
                                sortOrder === "asc" ? "ArrowDown" : "ArrowUp"
                              }
                              className={`w-4 h-4 transform transition ease-in duration-500`}
                            ></Lucide>
                          </span>
                        </Table.Th>
                        <Table.Th className="border-b-0 whitespace-nowrap">
                          Profile
                        </Table.Th>
                        <Table.Th className="border-b-0 whitespace-nowrap">
                          Name
                        </Table.Th>
                        <Table.Th className="border-b-0 whitespace-nowrap">
                          Email
                        </Table.Th>
                        <Table.Th className="border-b-0 whitespace-nowrap">
                          Company Name
                        </Table.Th>
                        <Table.Th className="border-b-0 whitespace-nowrap">
                          Account Name
                        </Table.Th>
                        <Table.Th className="border-b-0 whitespace-nowrap">
                          Last Login
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
                      {displayedUser.map((user: any) => (
                        <Table.Tr key={user.id} className="intro-x">
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                            <span>{user.id}</span>
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                            <div className="flex -ml-[0.35rem]">
                              <div className="w-7 h-7 image-fit zoom-in">
                                <Tippy
                                  as="img"
                                  alt={user.name.slice(0, 10) + "..."}
                                  className="rounded-full shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
                                  src={
                                    user.profile_pic !== ""
                                      ? `${
                                          import.meta.env
                                            .VITE_REACT_APP_USER_IMAGE_URL
                                        }/${user.profile_pic}`
                                      : `/sskit/user.png`
                                  }
                                  content={`Uploaded at ${moment(
                                    user.updated_at
                                  ).format(DATE_TIME_FORMAT)}`}
                                  onClick={() => {
                                    if (user.profile_pic) {
                                      openImageInNewTab(
                                        `${
                                          import.meta.env
                                            .VITE_REACT_APP_USER_IMAGE_URL
                                        }/${user.profile_pic}`
                                      );
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] capitalize">
                            {user.name ? user.name : "N/A"}
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                            <div className="w-[150px] break-words">
                              {user.email ? user.email : "N/A"}
                            </div>
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] capitalize">
                            {user.company_detail === null
                              ? "N/A"
                              : user.company_detail?.name}
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] capitalize">
                            {user.account_detail === null
                              ? "N/A"
                              : user.account_detail?.name}
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                            <div className="flex items-center">
                              {user?.last_login
                                ? moment(user.last_login).format(
                                    DATE_TIME_FORMAT
                                  )
                                : "N/A"}
                            </div>
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                            <div className="flex items-center">
                              <FormSwitch>
                                <FormSwitch.Input
                                  id={`checkbox-switch-7${user.id}`}
                                  type="checkbox"
                                  className="shadow-xl border-slate-300"
                                  onChange={(e) => changeStatus(e, user.id)}
                                  checked={user.enable === 1 ? true : false}
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
                                  <Tippy content="Update User">
                                    <span
                                      className="flex items-center cursor-pointer"
                                      onClick={() => updateUser(user.id)}
                                    >
                                      <Lucide
                                        icon="Edit"
                                        className="w-4 h-4 text-blue-600 dark:text-blue-400"
                                      />
                                    </span>
                                  </Tippy>
                                )}

                                {(hasDeletePermission ||
                                  role === SUPER_ADMIN) && (
                                  <Tippy content="Delete User">
                                    <span
                                      className="flex items-center cursor-pointer"
                                      onClick={() =>
                                        openDeleteUserModal(user.id)
                                      }
                                    >
                                      <Lucide
                                        icon="Trash2"
                                        className="w-4 h-4 text-red-600 dark:text-red-500"
                                      />
                                    </span>
                                  </Tippy>
                                )}

                                {(hasViewPermission || role === SUPER_ADMIN) &&
                                  !user.is_email_verified && (
                                    <Tippy content="Resend Verification Email">
                                      <span
                                        className="flex items-center cursor-pointer"
                                        onClick={() =>
                                          openVerificationEmailModal(user.id)
                                        }
                                      >
                                        <Lucide
                                          icon="Send"
                                          className="w-4 h-4 text-amber-600 dark:text-amber-400"
                                        />
                                      </span>
                                    </Tippy>
                                  )}
                              </div>
                            </Table.Td>
                          )}
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

          {/* BEGIN: Delete Confirmation Modal */}
          <Dialog
            open={deleteUserModal}
            onClose={() => {
              setDeleteUserModal(false);
            }}
            initialFocus={deleteButtonRef}
          >
            <Dialog.Panel>
              <div className="p-5 text-center">
                <div className="mt-5 text-lg sm:text-xl">
                  Are you sure to delete this user?
                </div>
              </div>
              <div className="px-5 pb-8 text-center flex justify-end gap-5">
                <Button
                  variant="outline-secondary"
                  type="button"
                  onClick={() => {
                    setDeleteUserModal(false);
                  }}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  type="button"
                  ref={deleteButtonRef}
                  onClick={deleteSelectedUser}
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
                    "Delete User"
                  )}
                </Button>
              </div>
            </Dialog.Panel>
          </Dialog>
          {/* END: Delete Confirmation Modal */}

          {/* Activate / Deactivate Modal */}
          <ActivateModal
            checked={isUserChecked}
            isLoading={isLoading}
            moduleName="user"
            open={activateUserModal}
            onClose={() => setActivateUserModal(false)}
            onClick={activateSelectedUser}
            focusRef={activateBtnRef}
          />

          {/* Resend Email Verification Modal */}
          <EmailVerificationModal
            emailVerificationBtnRef={emailVerificationBtnRef}
            emailVerificationModal={emailVerificationModal}
            isLoading={isLoading}
            resendVerificationEmail={resendVerificationEmail}
            setEmailVerificationModal={setEmailVerificationModal}
          />
        </div>
      )}
    </>
  );
};

export default index;
