import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import CustomLoader from "../../components/Loader/CustomLoader";
import Table from "../../base-components/Table";
import clsx from "clsx";
import AddModuleModal from "../../components/ModuleManagement/AddModuleModal";
import EditModuleModal from "../../components/ModuleManagement/EditModuleModal";
import {
  deleteModule,
  fetchAllModules,
  getModulesData,
} from "../../stores/module";
import { selectDarkMode } from "../../stores/darkModeSlice";
import { Controller, useForm } from "react-hook-form";
import {
  ITEMS_PER_PAGE_OPTIONS,
  PAGE_LIMIT,
  SUCCESS_CODE,
  SUPER_ADMIN,
} from "../../utils/constants";
import { toast } from "react-toastify";
import { FormInput } from "../../base-components/Form";
import { Autocomplete, TextField } from "@mui/material";
import { Dialog } from "../../base-components/Headless";
import LoadingIcon from "../../base-components/LoadingIcon";
import { useNavigate } from "react-router-dom";
import CancelSearchText from "../../components/NoData/CancelSearchText";
import secureLocalStorage from "react-secure-storage";
import ResetOrSearchButton from "../../components/HelperButton";
import CustomPagination from "../../components/Pagination/CustomPagination";

type ModuleType = {
  id: number;
  name: string;
  enable: number;
};

const filterList = [
  { label: "Active", value: "active" },
  { label: "Deactive", value: "deactive" },
  { label: "All", value: "all" },
];

const index: React.FC = () => {
  const role = secureLocalStorage.getItem("role");
  const moduleState: any = useAppSelector(getModulesData);
  const itemsPerPageOptions: number[] = ITEMS_PER_PAGE_OPTIONS;
  const [itemsPerPage, setItemsPerPage] = useState<number>(PAGE_LIMIT);
  const [limit, setLimit] = useState<number>(moduleState.limit);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [deleteModuleModal, setDeleteModuleModal] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchText, setSearchText] = useState<string>("");
  const totalPages: number = Math.ceil(
    moduleState.totalRecords / moduleState.limit
  );
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [filterModule, setFilterModule] = useState<string>("all");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);
  const dispatch = useAppDispatch();
  const darkMode = useAppSelector(selectDarkMode);
  const deleteButtonRef = useRef(null);
  const navigate = useNavigate();

  let startIndex: number = (currentPage - 1) * itemsPerPage;
  let endIndex: number = Math.min(
    startIndex + itemsPerPage,
    moduleState.modules.length
  );

  if (endIndex - startIndex < itemsPerPage) {
    startIndex = Math.max(0, moduleState.modules.length - itemsPerPage);
    endIndex = moduleState.modules.length;
  }

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const sortedItems = [...moduleState.modules].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.id - b.id;
    } else {
      return b.id - a.id;
    }
  });

  const displayedModules = sortedItems.slice(startIndex, endIndex);

  const { control } = useForm({
    mode: "onChange",
  });

  useEffect(() => {
    const fetchModulesData = async () => {
      if (role === SUPER_ADMIN) {
        await dispatch(
          fetchAllModules({
            limit: PAGE_LIMIT,
            page: currentPage,
            searchText,
            ...(filterModule !== "all" && {
              enable: filterModule === "active" ? 1 : 0,
            }),
          })
        );
      } else {
        navigate("/unauthorized");
      }
    };
    fetchModulesData();
  }, []);

  const handleSearchAndFilter = async () => {
    try {
      setIsSearchLoading(true);
      const newLimit = itemsPerPage;
      setItemsPerPage(newLimit);
      setLimit(newLimit);
      await dispatch(
        fetchAllModules({
          limit,
          page: 1,
          searchText,
          ...(filterModule !== "all" && {
            enable: filterModule === "active" ? 1 : 0,
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
    setFilterModule("all");
    setItemsPerPage(PAGE_LIMIT);
    setLimit(PAGE_LIMIT);
    try {
      setIsResetLoading(true);
      await dispatch(
        fetchAllModules({
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
        fetchAllModules({
          limit,
          page: pageNumber,
          searchText,
          ...(filterModule !== "all" && {
            enable: filterModule === "active" ? 1 : 0,
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
      fetchAllModules({
        limit: newItemsPerPage,
        page: 1,
        searchText,
        ...(filterModule !== "all" && {
          enable: filterModule === "active" ? 1 : 0,
        }),
      })
    );
    setCurrentPage(1);
  };

  const openDeleteModuleModal = (id: number) => {
    setSelectedModuleId(id);
    setDeleteModuleModal(true);
  };

  const deleteSelectedModule = async () => {
    try {
      setIsLoading(true);
      const res = await dispatch(deleteModule(Number(selectedModuleId)));
      if (res.payload?.status === SUCCESS_CODE) {
        dispatch(fetchAllModules({ limit, page: 1, searchText: "" }));
        toast.success(
          res.payload.data?.message || "Module deleted successfully"
        );
        setSearchText("");
        setFilterModule("all");
        setCurrentPage(1);
        setDeleteModuleModal(false);
      } else {
        return toast.error(
          res.payload.response?.data?.message || "Something went wrong"
        );
      }
    } catch (error) {
      console.log("Err-", error);
    } finally {
      setIsLoading(false);
    }
  };

  const openEditModal = (id: number) => {
    setSelectedModuleId(id);
    setEditModal(true);
  };

  return (
    <div>
      {role === SUPER_ADMIN && (
        <>
          <div className="flex flex-wrap gap-3 sm:gap-5 mt-3 sm:mt-5 px-2">
            <div className="w-full sm:w-40">
              <Controller
                name="moduleStatus"
                control={control}
                render={({ field: { value } }) => {
                  const selectedState: any = filterList?.find(
                    (option) => option.value === value
                  );
                  const selectedVal = filterList?.find(
                    (option) => option.value === filterModule
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
                          setFilterModule(newVal?.value);
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
                  placeholder="Search by module name..."
                  onChange={(e) => setSearchText(e.target.value)}
                  value={searchText}
                  name="ModuleSearch"
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
            {role === SUPER_ADMIN && (
              <Button
                variant="primary"
                className="mb-2 mr-2 text-xs py-[0.3rem]"
                onClick={() => setAddModal(true)}
              >
                <Lucide icon="PlusCircle" className="mr-2 w-5" /> Add Module
              </Button>
            )}
          </div>

          <>
            {moduleState.loading ? (
              <CustomLoader color="fill-green-600" />
            ) : (
              <div className="mt-3">
                {/* BEGIN: Data List */}
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
                          Name
                        </Table.Th>
                        <Table.Th className="border-b-0 whitespace-nowrap">
                          Status
                        </Table.Th>
                        {role === SUPER_ADMIN && (
                          <Table.Th className="border-b-0 whitespace-nowrap">
                            Action
                          </Table.Th>
                        )}
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {displayedModules?.map((module: ModuleType) => (
                        <Table.Tr key={module.id} className="intro-x">
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                            {module.id}
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md uppercase last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                            {module?.name ? module.name : "N/A"}
                          </Table.Td>
                          <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                            <div
                              className={clsx({
                                "flex items-center": true,
                                "text-success dark:text-green-500":
                                  module.enable === 1,
                                "text-danger dark:text-red-500":
                                  module.enable === 0,
                              })}
                            >
                              <Lucide
                                icon={
                                  module.enable === 1
                                    ? "CheckSquare"
                                    : "XSquare"
                                }
                                className="w-4 h-4 mr-2"
                              />
                              {module.enable === 1 ? "Active" : "Inactive"}
                            </div>
                          </Table.Td>
                          {role === SUPER_ADMIN && (
                            <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                              <div className="flex items-center gap-2">
                                {role === SUPER_ADMIN && (
                                  <span
                                    className="flex items-center cursor-pointer"
                                    onClick={() => openEditModal(module.id)}
                                  >
                                    <Lucide
                                      icon="Edit"
                                      className="w-4 h-4 text-blue-600 dark:text-blue-400"
                                    />
                                  </span>
                                )}

                                {role === SUPER_ADMIN && (
                                  <span
                                    className="flex items-center cursor-pointer"
                                    onClick={() =>
                                      openDeleteModuleModal(module.id)
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
                {moduleState.modules.length === 0 && (
                  <h1
                    className={`text-center mt-10 text-xl sm:text-2xl font-medium ${
                      moduleState.loading ? "text-inherit" : "text-[#8b8a8a]"
                    }`}
                  >
                    No data to display...
                  </h1>
                )}
                {/* END: Data List */}
                {/* BEGIN: Pagination */}
                {/* {moduleState.modules.length > 0 && ( */}
                <CustomPagination
                  currentPage={currentPage}
                  darkMode={darkMode}
                  handleItemsPerPageChange={handleItemsPerPageChange}
                  handlePageChange={handlePageChange}
                  itemsPerPage={itemsPerPage}
                  itemsPerPageOptions={itemsPerPageOptions}
                  totalPages={totalPages}
                  totalRecords={moduleState.totalRecords}
                />
                {/* )} */}
                {/* END: Pagination */}

                {/* BEGIN: Delete Confirmation Modal */}
                <Dialog
                  open={deleteModuleModal}
                  onClose={() => {
                    setDeleteModuleModal(false);
                  }}
                  initialFocus={deleteButtonRef}
                >
                  <Dialog.Panel>
                    <div className="p-5 text-center">
                      <div className="mt-5 text-lg sm:text-xl">
                        Are you sure to delete this module?
                      </div>
                    </div>
                    <div className="px-5 pb-8 text-center flex justify-end gap-5">
                      <Button
                        variant="outline-secondary"
                        type="button"
                        onClick={() => {
                          setDeleteModuleModal(false);
                        }}
                        className="text-xs"
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="danger"
                        type="button"
                        ref={deleteButtonRef}
                        onClick={deleteSelectedModule}
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
                          "Delete Module"
                        )}
                      </Button>
                    </div>
                  </Dialog.Panel>
                </Dialog>
                {/* END: Delete Confirmation Modal */}
              </div>
            )}
          </>

          <AddModuleModal
            addModal={addModal}
            setAddModal={setAddModal}
            currentPage={currentPage}
            limit={limit}
            searchText={searchText}
            setFilterModule={setFilterModule}
          />
          <EditModuleModal
            editModal={editModal}
            setEditModal={setEditModal}
            editModalId={Number(selectedModuleId)}
            currentPage={currentPage}
            limit={limit}
            searchText={searchText}
            setFilterModule={setFilterModule}
          />
        </>
      )}
    </div>
  );
};

export default index;
