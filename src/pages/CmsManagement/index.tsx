// index.tsx
import {
  ChangeEvent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { fetchAllCmsData, deleteCmsEntry } from "../../stores/cms";
import { RootState } from "../../stores/store";
import Table from "../../base-components/Table";
import Lucide from "../../base-components/Lucide";
import Button from "../../base-components/Button";
import { useNavigate } from "react-router-dom";
import { FormInput, FormSelect } from "../../base-components/Form";
import moment from "moment";
import { useAppDispatch } from "../../stores/hooks";
import LoadingIcon from "../../base-components/LoadingIcon";
import CustomLoader from "../../components/Loader/CustomLoader";
import { Dialog } from "../../base-components/Headless";
import { SUCCESS_CODE } from "../../utils/constants";
import { toast } from "react-toastify";
import CancelSearchText from "../../components/HelperButton/CancelSearchText";
import ResetOrSearchButton from "../../components/HelperButton";

const Index = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // State for managing data
  const [status, setStatus] = useState("active");
  const [currentPage, setCurrentPage] = useState(1);
  const [dataLimit, setDataLimit] = useState(10);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCmsId, setSelectedCmsId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [triggerSearch, setTriggerSearch] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);
  const deleteButtonRef = useRef(null);

  const { cmsData, totalPages, loading, totalRecords } = useSelector(
    (state: RootState) => state.cms
  );

  const openDeleteModal = (id: number) => {
    setSelectedCmsId(id);
    setDeleteModalOpen(true);
  };

  const handleDeleteCms = async () => {
    try {
      if (selectedCmsId) {
        setIsLoading(true);
        const res: any = await dispatch(deleteCmsEntry(selectedCmsId));
        if (res.payload.status === SUCCESS_CODE) {
          toast.success(
            res.payload.message || "Cms has been deleted successfully."
          );
          await dispatch(
            fetchAllCmsData({
              limit: dataLimit,
              page: currentPage,
              search: searchText,
            })
          );
          setIsLoading(false);
          setDeleteModalOpen(false);
          setSearchText("");
          setCurrentPage(1);
        }
      }
    } catch (error) {
      console.log("error while deleting cms: ", error);
    }
  };

  // const confirmToggleStatus = () => {
  //   const newStatus = selectedCms.status === 1 ? 0 : 1;
  //   dispatch(
  //     activateDeactivateCmsEntry({
  //       id: selectedCms.id,
  //       status: newStatus.toString(),
  //     })
  //   )
  //     .then(() => {
  //       dispatch(
  //         fetchAllCmsData({
  //           limit: dataLimit,
  //           page: currentPage,
  //           search: searchText,
  //           status: status === "all" ? "" : status,
  //         })
  //       );
  //     })
  //     .catch((err) => console.error("Error toggling CMS status:", err));
  //   setShowStatusDialog(false);
  // };

  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
    if (e.target.value.trim() === "") {
      setCurrentPage(1);
      setTriggerSearch((prev) => !prev);
    }
  };

  const handleSelectChange = (value: SetStateAction<string>) =>
    setStatus(value);

  const handleDataLimitChange = (e: ChangeEvent<HTMLSelectElement>) =>
    setDataLimit(Number(e.target.value));

  const resetFilter = async () => {
    setSearchText("");
    try {
      setIsResetLoading(true);
      await dispatch(
       fetchAllCmsData({
        limit: dataLimit,
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

  useEffect(() => {
    dispatch(
      fetchAllCmsData({
        limit: dataLimit,
        page: currentPage,
        search: searchText,
      })
    );
  }, [dispatch, currentPage, dataLimit, triggerSearch, status]);

  const viewDescription = (id: number, isRelease: boolean) => {
    if (isRelease) {
      navigate("/cms/viewdescription", { state: { cmsId: id } });
    } else {
      const cmsEntry = cmsData.find((entry: any) => entry.id === id);
      if (cmsEntry) {
        openPlainTextTab(cmsEntry.page_description);
      }
    }
  };

  function openPlainTextTab(plainText: any) {
    const newTab = window.open();
    if (newTab) {
      newTab.document.open();
      newTab.document.write("<pre>" + plainText + "</pre>");
      newTab.document.close();
    } else {
      console.error(
        "Failed to open a new tab. This might be blocked by the browser."
      );
      alert("Unable to open the new tab. Please check your browser settings.");
    }
  }

  const changePage = (newPage: number) => setCurrentPage(newPage);

  const updateCmsbyid = async (id: number) => {
    try {
      navigate("/cms/manage", { state: { cmsId: id } });
    } catch (err) {
      console.error("Error fetching cms by ID:", err);
    }
  };
  
  const handleSearchAndFilter = async () => {
    try {
      setIsLoading(true);
      await dispatch(
        fetchAllCmsData({
          limit: dataLimit,
          page: 1,
          search: searchText,
        })
      );
    } catch (error) {
      console.log("Err--", error);
    } finally {
      setIsLoading(false);
      setCurrentPage(1);
    }
  };

  return (
    <div>
      <div>
        <div className="grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-3 sm:mt-5 justify-end sm:justify-end flex sm:flex-row flex-col items-end">
          {/* Search */}
          <div className="w-full sm:order-2 order-1 sm:ml-auto">
            <div className="relative text-slate-500">
              <FormInput
                type="text"
                className="dark:text-gray-300"
                placeholder="Search by admin name, email, phone number"
                onChange={handleSearchInputChange}
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
              disabled={isLoading}
              onClick={handleSearchAndFilter}
            />
            <ResetOrSearchButton
              type="reset"
              disabled={isResetLoading}
              onClick={resetFilter}
            />
            <Button
              variant="primary"
              onClick={() => navigate("/cms/manage")}
              className="w-max"
            >
              <Lucide icon="PlusCircle" className="w-4 h-4 mr-2" />
              Add CMS Details
            </Button>
          </div>
        </div>

        {loading ? (
          <CustomLoader color="fill-orange-600" />
        ) : (
          <div className="mt-3">
            <div className="col-span-12 overflow-auto intro-y lg:overflow-visible">
              <Table className="border-spacing-y-[10px] border-separate -mt-2">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th className="border-b-0 whitespace-nowrap">
                      #
                    </Table.Th>
                    <Table.Th className="border-b-0 whitespace-nowrap">
                      Name
                    </Table.Th>
                    <Table.Th className="border-b-0 whitespace-nowrap">
                      Slug
                    </Table.Th>
                    <Table.Th className="border-b-0 whitespace-nowrap">
                      Page Title
                    </Table.Th>
                    <Table.Th className="border-b-0 whitespace-nowrap">
                      Created At
                    </Table.Th>
                    <Table.Th className="border-b-0 whitespace-nowrap">
                      Status
                    </Table.Th>
                    <Table.Th className="border-b-0 whitespace-nowrap">
                      Is Release
                    </Table.Th>
                    <Table.Th className="border-b-0 whitespace-nowrap">
                      Action
                    </Table.Th>
                  </Table.Tr>
                </Table.Thead>
                {cmsData.map((data: any, idx: number) => (
                  <Table.Tbody key={data.id}>
                    <Table.Tr className="intro-x">
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        {(currentPage - 1) * dataLimit + idx + 1}
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        {data.name}
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        {data.slug}
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] w-[180px]">
                        {data.page_title}
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        {moment(data.created_at).format("MM/DD/YYYY hh:mm a")}
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <div className="flex items-center">
                          <span
                            className={`px-2 py-1 rounded font-semibold text-xs
                            ${
                              data.enable
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {data.enable ? "Enabled" : "Disabled"}
                          </span>
                        </div>
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <div className="flex items-center">
                          <span
                            className={`px-2 py-1 rounded font-semibold text-xs
                            ${
                              data.is_release
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {data.is_release ? "Yes" : "No"}
                          </span>
                        </div>
                      </Table.Td>
                      <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                        <div className="flex gap-3">
                          <span className="flex items-center cursor-pointer">
                            <Lucide
                              icon="Eye"
                              className="w-4 h-4 text-green-600"
                              onClick={() =>
                                viewDescription(data.id, data.is_release)
                              }
                            />
                          </span>
                          <span className="flex items-center cursor-pointer">
                            <Lucide
                              icon="Edit"
                              className="w-4 h-4 text-blue-500"
                              onClick={() => updateCmsbyid(data.id)}
                            />
                          </span>
                          <span className="flex items-center cursor-pointer">
                            <Lucide
                              icon="Trash2"
                              className="w-4 h-4 text-red-500"
                              onClick={() => openDeleteModal(data.id)}
                            />
                          </span>
                        </div>
                      </Table.Td>
                    </Table.Tr>
                  </Table.Tbody>
                ))}
              </Table>
            </div>
            {cmsData.length === 0 && (
              <h1
                className={`text-center mt-10 text-2xl font-medium text-[#8b8a8a]`}
              >
                No data to display...
              </h1>
            )}
            <div className="flex flex-wrap items-center justify-between col-span-12 mt-5 gap-5 intro-y sm:flex-row mb-10">
              <div className="flex flex-wrap gap-2 sm:gap-5 sm:mr-auto ml-9">
                <Button
                  disabled={currentPage === 1}
                  onClick={() => changePage(currentPage - 1)}
                >
                  <Lucide icon="ChevronsLeft" className="w-4 h-4" />
                </Button>
                {Array.from({ length: totalPages }).map((_, index) => {
                  const currentPageNumber = index + 1;
                  const shouldDisplay =
                    currentPageNumber <= 2 ||
                    currentPageNumber > totalPages - 2 ||
                    (currentPageNumber >= currentPage - 1 &&
                      currentPageNumber <= currentPage + 1);

                  if (shouldDisplay) {
                    return (
                      <Button
                        key={index}
                        onClick={() => changePage(currentPageNumber)}
                        className={`${
                          currentPageNumber === currentPage
                            ? "!box font-medium dark:bg-darkmode-400"
                            : ""
                        } px-[0.9rem]`}
                      >
                        {currentPageNumber}
                      </Button>
                    );
                  }

                  if (
                    (currentPageNumber === 3 && currentPage > 2) ||
                    (currentPageNumber === totalPages - 2 &&
                      currentPage < totalPages - 1)
                  ) {
                    return (
                      <p key={index} className="mt-1">
                        ...
                      </p>
                    );
                  }

                  return null;
                })}
                {currentPage < totalPages && (
                  <Button onClick={() => setCurrentPage(currentPage + 1)}>
                    <Lucide icon="ChevronRight" className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  <Lucide icon="ChevronsRight" className="w-4 h-4" />
                </Button>
              </div>
              <h1>
                Total Records -{" "}
                <span className="font-semibold">{totalRecords}</span>
              </h1>
              <div>
                <div className="mr-2 w-24">
                  <FormSelect
                    className="w-20 !box mr-10"
                    value={dataLimit}
                    onChange={handleDataLimitChange}
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </FormSelect>
                </div>
              </div>
            </div>
          </div>
        )}
        <Dialog
          open={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
          }}
          initialFocus={deleteButtonRef}
        >
          <Dialog.Panel>
            <div className="p-5 text-center">
              <div className="mt-5 text-lg sm:text-xl">
                Are you sure to delete this cms?
              </div>
            </div>
            <div className="px-5 pb-8 text-center flex justify-end gap-5">
              <Button
                variant="outline-secondary"
                type="button"
                onClick={() => {
                  setDeleteModalOpen(false);
                }}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                type="button"
                ref={deleteButtonRef}
                onClick={handleDeleteCms}
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
                  "Delete CMS"
                )}
              </Button>
            </div>
          </Dialog.Panel>
        </Dialog>
      </div>
    </div>
  );
};

export default Index;
