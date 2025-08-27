import React, { ChangeEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../stores/store";
import {
  FormInput,
  FormLabel,
  FormCheck,
  FormTextarea,
} from "../../base-components/Form";
import Button from "../../base-components/Button";
import { ClassicEditor } from "../../base-components/Ckeditor";
import {
  addCmsEntry,
  fetchCmsById,
  deleteVersionHistory,
  updateCmsEntry,
} from "../../stores/cms";
import { displayToast } from "../../stores/toastSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import PageHeader from "./../../components/PageHeader/index";
import { SUCCESS_CODE } from "../../utils/constants";
// import { Controller, useForm } from "react-hook-form";
// import { Autocomplete, TextField } from "@mui/material";
// import { capitalizeByCharacter } from "../../utils/helper";
// import { selectDarkMode } from "../../stores/darkModeSlice";
// import { useAppSelector } from "../../stores/hooks";

type InitialState = {
  name: string;
  title: string;
  description: string;
  meta_tags: string;
  meta_description: string;
  isRelease: boolean;
};

const initialState: InitialState = {
  name: "",
  title: "",
  description: "",
  meta_tags: "",
  meta_description: "",
  isRelease: false,
};

type TextInputState = {
  name: string;
  title: string;
  description: string;
  meta_tags: string;
  meta_description: string;
  isRelease: boolean;
};

type FormState = TextInputState;

type DynamicFieldsState = {
  id: number | string;
  description: string;
  versionNumber: string;
  platform: string;
  forceupdate: string;
  is_created?: number;
  is_updated?: number;
  is_deleted?: number;
};

type ErrorState = {
  name: string;
  title: string;
};

type DynamicErrorState = {
  id: number | string;
  description: string;
  versionNumber: string;
  platform: string;
};

const AddDetails: React.FC = () => {
  const [initFormData, setInitFormData] = useState<FormState>({
    ...initialState,
  });

  const [dynamicFields, setDynamicFields] = useState<Array<DynamicFieldsState>>(
    [
      {
        id: 1,
        description: "",
        versionNumber: "",
        platform: "",
        forceupdate: "0",
        is_created: 1,
      },
    ]
  );
  const [formErrors, setFormErrors] = useState<ErrorState>({
    name: "",
    title: "",
  });
  const [dynamicFormErrors, setDynamicFormErrors] = useState<
    Array<DynamicErrorState>
  >([
    {
      id: 1,
      description: "",
      versionNumber: "",
      platform: "",
    },
  ]);

  // const forceUpdateDropdown = [
  //   { value: 1, label: "True" },
  //   { value: 2, label: "False" },
  // ];

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [selectedFieldId, setSelectedFieldId] = useState<
    number | string | null
  >(null);
  // const [filterForceUpdateStatus, setFilterForceUpdateStatus] =
  //   useState<string>("");
  // const darkMode = useAppSelector(selectDarkMode);

  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const location = useLocation();
  const cmsId = location.state?.cmsId;

  // const { control } = useForm({
  //   mode: "onChange",
  // });

  const handleDynamicInputChange = (
    id: number | string,
    field: keyof DynamicFieldsState,
    value: string | number
  ) => {
    if (field === "versionNumber" || field === "description") {
      if (value === "") {
        setDynamicFormErrors((prevErrors) =>
          prevErrors.map((error) =>
            error.id === id
              ? { ...error, [field]: `This field is required` }
              : error
          )
        );
      } else {
        setDynamicFormErrors((prevErrors) =>
          prevErrors.map((error) =>
            error.id === id ? { ...error, [field]: "" } : error
          )
        );
      }
    }

    if (field === "platform") {
      if (value === "") {
        setDynamicFormErrors((prevErrors) =>
          prevErrors.map((error) =>
            error.id === id
              ? { ...error, [field]: `Please select a platform` }
              : error
          )
        );
      } else {
        setDynamicFormErrors((prevErrors) =>
          prevErrors.map((error) =>
            error.id === id ? { ...error, [field]: "" } : error
          )
        );
      }
    }

    setDynamicFields((prevFields) =>
      prevFields.map((item) => {
        if (item.id === id) {
          const isUpdated = item[field] !== value;
          const isCreatedExist = item.is_created ?? 0;

          return {
            ...item,
            [field]: value,
            is_updated: isUpdated && !isCreatedExist ? 1 : item.is_updated,
          };
        }
        return item;
      })
    );
  };

  const handleAddMoreFields = () => {
    setDynamicFields((prevFields) => [
      ...prevFields,
      {
        id: ++prevFields.length,
        description: "",
        versionNumber: "",
        platform: "",
        forceupdate: "0",
        is_created: 1,
      },
    ]);
  };

  const handleRemoveField = (id: number | string) => {
    const field = dynamicFields.find((field) => field.id === id);
    if (field && !field?.is_created) {
      // Mark the field as deleted if it exists in the database
      setDynamicFields((prevFields) =>
        prevFields.map((f) => (f.id === id ? { ...f, is_deleted: 1 } : f))
      );
      setSelectedFieldId(id);
      setIsDeleteModalOpen(true);
    } else {
      // If the field is not in the database, remove it directly
      setDynamicFields((prevFields) => prevFields.filter((f) => f.id !== id));
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedFieldId !== null && cmsId) {
      try {
        // Call the delete API with the specific version history ID
        const response = await dispatch(
          deleteVersionHistory({
            cmsId: Number(cmsId),
            versionHistoryId:
              typeof selectedFieldId === "string"
                ? Number(selectedFieldId)
                : selectedFieldId,
          })
        ).unwrap();

        toast.success(
          response.message || "Version history deleted successfully!"
        );

        // Update the state to remove only the specific form
        setDynamicFields((prevFields) =>
          prevFields.filter((field) => field.id !== selectedFieldId)
        );
      } catch (error: any) {
        toast.error(error.message || "Failed to delete version history.");
      } finally {
        setIsDeleteModalOpen(false);
        setSelectedFieldId(null);
      }
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setSelectedFieldId(null);
  };

  const handleUpdateCms = async (cmsId: string, updatedData: any) => {
    try {
      const formattedData = {
        id: Number(cmsId),
        name: updatedData.name,
        title: updatedData.title,
        description: updatedData.description,
        is_release: initFormData.isRelease,
        meta_tags: updatedData.meta_tags,
        meta_description: updatedData.meta_description,
        version_history: dynamicFields.map((field) => ({
          id: typeof field.id === "string" ? Number(field.id) : field.id,
          version_no: field.versionNumber,
          platform: field.platform,
          version_description: field.description,
          forceupdate: Number(field.forceupdate),
          is_created: field.is_created ?? 0,
          is_updated: field.is_updated ?? 0,
        })),
      };

      const res: any = await dispatch(updateCmsEntry(formattedData)).unwrap();
      if (res?.status === SUCCESS_CODE) {
        toast.success(
          res?.data?.message || "Cms has been updated successfully!"
        );
        navigate("/cms");
      } else {
        toast.error(res?.response?.data?.message || "Failed to update cms.");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update cms.");
      console.error(error);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const errors: {
        name: string;
        title: string;
      } = { name: "", title: "" };

      if (initFormData.name === "") {
        errors.name = "Name is required";
      }
      if (initFormData.title === "") {
        errors.title = "Page title is required";
      }
      setFormErrors(errors as ErrorState);
      if (errors.name || errors.title) return;

      if(initFormData.isRelease) {
        if (
          dynamicFields.some(
            (field) =>
              field.versionNumber === "" ||
              field.platform === "" ||
              field.description === ""
          )
        ) {
          setDynamicFormErrors(
            dynamicFields.map((field) => ({
              id: field.id,
              versionNumber:
                field.versionNumber === "" ? "This field is required" : "",
              platform: field.platform === "" ? "Please select a platform" : "",
              description:
                field.description === "" ? "This field is required" : "",
            }))
          );
          setIsLoading(false);
          return;
        }
      }

      if (cmsId) {
        await handleUpdateCms(cmsId, initFormData);
      } else {
        const response = await dispatch(
          addCmsEntry({ ...initFormData, versionHistory: dynamicFields })
        ).unwrap();
        if (response?.status === SUCCESS_CODE) {
          toast.success(
            response?.data?.message || "Cms has been added successfully"
          );
          navigate("/cms");
          setInitFormData({ ...initialState });
        } else {
          toast.error(
            response?.response?.data?.message || "Failed to add cms."
          );
        }
      }
    } catch (error: any) {
      dispatch(
        displayToast({
          msg: error?.message || "Failed to save cms.",
          type: "Error",
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (cmsId) {
        try {
          const response = await dispatch(fetchCmsById(cmsId)).unwrap();
          setInitFormData({
            name: response?.data?.data?.name,
            title: response?.data?.data?.page_title,
            description: response?.data?.data?.page_description ?? "",
            isRelease:
              response?.data?.data?.version_history?.length !== 0
                ? true
                : false,
            meta_tags: response?.data?.data?.meta_tags || "",
            meta_description: response?.data?.data?.meta_description || "",
          });
          if (response?.data?.data?.version_history?.length !== 0) {
            setDynamicFields(
              response.data.data.version_history.map((version: any) => ({
                id: version.id,
                description: version.description,
                versionNumber: version.title,
                platform: version.platform === 1 ? "android" : "ios",
                forceupdate: String(version.is_force),
              }))
            );
          }
        } catch (error) {
          dispatch(
            displayToast({ msg: "Failed to load cms details", type: "Error" })
          );
        }
      }
    };

    loadData();
  }, [cmsId, location.state, dispatch]);

  const handleEditorChange = (e: any) => {
    setInitFormData((prevData) => ({
      ...prevData,
      description: e,
    }));
  };

  const handleInputChange = <
    T extends HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  >(
    e: ChangeEvent<T>,
    field: string
  ) => {
    if (field === "name") {
      setFormErrors((prev) => ({
        ...prev,
        name: value ? "" : "Name is required",
      }));
    }

    if (field === "title") {
      setFormErrors((prev) => ({
        ...prev,
        title: value ? "" : "Page title is required",
      }));
    }

    const value =
    e.target.type === "checkbox"
    ? (e.target as HTMLInputElement).checked
    : e.target.value;

    setInitFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // const filterByForceUpdateStatus = (selectedVal: string) => {
  //   setFilterForceUpdateStatus(selectedVal);
  // };

  return (
    <>
      <div>
        <PageHeader
          HeaderText="Details"
          Breadcrumb={[
            { name: cmsId ? "Update Details" : "Add Details", navigate: "#" },
          ]}
          to="/cms"
        />
        <div className="flex items-center mt-5">
          <h2 className="mr-auto text-lg font-medium intro-y">
            {cmsId ? "Update Details" : "Add Details"}
          </h2>
        </div>
        <div className="py-5 mt-5 intro-y box">
          <div className="px-5 sm:px-20">
            <form
              className="grid grid-cols-12 gap-4 mt-5 gap-y-5"
              name="detailForm"
              onSubmit={handleSubmit}
              encType="multipart/form-data"
            >
              <div className="col-span-12 intro-y sm:col-span-6">
                <FormLabel htmlFor="name">
                  Name<span className="text-red-600 font-bold ms-1">*</span>
                </FormLabel>
                <FormInput
                  id="name"
                  type="text"
                  name="name"
                  onInput={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(e, "name")
                  }
                  value={initFormData.name}
                />
                {formErrors.name && (
                  <p className="mt-1 text-xs text-red-500">{formErrors.name}</p>
                )}
              </div>
              <div className="col-span-12 intro-y sm:col-span-6">
                <FormLabel htmlFor="title">
                  Page Title
                  <span className="text-red-600 font-bold ms-1">*</span>
                </FormLabel>
                <FormInput
                  id="title"
                  type="text"
                  name="title"
                  onInput={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(e, "title")
                  }
                  value={initFormData.title}
                />
                {formErrors.title && (
                  <p className="mt-1 text-xs text-red-500">
                    {formErrors.title}
                  </p>
                )}
              </div>

              {!cmsId && (
                <div className="col-span-12 intro-y sm:col-span-12">
                  <FormLabel htmlFor="isRelease">Is Release?</FormLabel>
                  <FormCheck>
                    <FormCheck.Input
                      id="isRelease"
                      type="checkbox"
                      name="isRelease"
                      checked={initFormData.isRelease}
                      onChange={(e) => handleInputChange(e, "isRelease")}
                    />
                  </FormCheck>
                </div>
              )}

              {initFormData.isRelease &&
                dynamicFields.map(
                  (field, index) =>
                    field.is_deleted !== 1 && (
                      <div
                        key={field.id}
                        className="col-span-12 border p-4 rounded-lg bg-gray-100"
                      >
                        <div className="grid grid-cols-12 gap-4">
                          <div className="col-span-12 sm:col-span-4">
                            <FormLabel htmlFor={`versionNumber-${field.id}`}>
                              Version Number
                              <span className="text-red-600 font-bold ms-1">
                                *
                              </span>
                            </FormLabel>
                            <FormInput
                              id={`versionNumber-${field.id}`}
                              type="text"
                              name="versionNumber"
                              onInput={(e: ChangeEvent<HTMLInputElement>) =>
                                handleDynamicInputChange(
                                  field.id,
                                  "versionNumber",
                                  e.target.value
                                )
                              }
                              value={field.versionNumber || ""}
                            />
                            {dynamicFormErrors.find(
                              (error) => error.id === field.id
                            )?.versionNumber && (
                              <p className="mt-1 text-xs text-red-500">
                                {
                                  dynamicFormErrors.find(
                                    (error) => error.id === field.id
                                  )?.versionNumber
                                }
                              </p>
                            )}
                          </div>
                          <div className="col-span-12 sm:col-span-4">
                            <FormLabel htmlFor={`platform-${field.id}`}>
                              Platform
                              <span className="text-red-600 font-bold ms-1">
                                *
                              </span>
                            </FormLabel>
                            <select
                              id={`platform-${field.id}`}
                              name="platform"
                              value={field.platform}
                              onChange={(e) =>
                                handleDynamicInputChange(
                                  field.id,
                                  "platform",
                                  e.target.value
                                )
                              }
                              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
                            >
                              <option value="">Select Platform</option>
                              <option value="ios">IOS</option>
                              <option value="android">Android</option>
                            </select>
                            {dynamicFormErrors.find(
                              (error) => error.id === field.id
                            )?.platform && (
                              <p className="mt-1 text-xs text-red-500">
                                {
                                  dynamicFormErrors.find(
                                    (error) => error.id === field.id
                                  )?.platform
                                }
                              </p>
                            )}
                          </div>
                          <div className="col-span-12 sm:col-span-4">
                            <FormLabel htmlFor={`forceupdate-${field.id}`}>
                              Select Force Update
                            </FormLabel>
                            <select
                              id={`forceupdate-${field.id}`}
                              name="forceupdate"
                              value={field.forceupdate}
                              onChange={(e) =>
                                handleDynamicInputChange(
                                  field.id,
                                  "forceupdate",
                                  e.target.value
                                )
                              }
                              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
                            >
                              {/* <option value="">Select Force Update</option> */}
                              <option value="1">True</option>
                              <option value="0">False</option>
                            </select>
                          </div>
                          {/* <div className="col-span-12 sm:col-span-4">
                            <Controller
                              name="forceUpdateStatus"
                              control={control}
                              render={({ field: { value } }) => {
                                const selectedState = forceUpdateDropdown?.find(
                                  (option) => option.value === value
                                );
                                const selectedVal = forceUpdateDropdown?.find(
                                  (option) =>
                                    option.value ===
                                    Number(filterForceUpdateStatus)
                                );
                                const defaultValue =
                                  (selectedState === undefined
                                    ? selectedVal
                                    : selectedState) || null;

                                return (
                                  <Autocomplete
                                    disablePortal
                                    size="small"
                                    id="combo-box-role"
                                    componentsProps={{
                                      popper: {
                                        modifiers: [
                                          { name: "flip", enabled: false },
                                        ],
                                      },
                                    }}
                                    value={defaultValue as any}
                                    options={forceUpdateDropdown?.map(
                                      (data) => ({
                                        value: data.value,
                                        label: capitalizeByCharacter(
                                          data.label,
                                          "_"
                                        ),
                                      })
                                    )}
                                    getOptionLabel={(option) =>
                                      option.label ??
                                      capitalizeByCharacter(option.label, "_")
                                    }
                                    onChange={(_, newVal) =>
                                      filterByForceUpdateStatus(newVal?.value)
                                    }
                                    isOptionEqualToValue={(option, value) =>
                                      option.value ===
                                      (value.value ? value.value : null)
                                    }
                                    renderInput={(params) => (
                                      <TextField
                                        {...params}
                                        label="Select Force Update"
                                        className="custom-select w-full"
                                        InputLabelProps={{
                                          style: {
                                            fontSize: 12,
                                            color: `${
                                              darkMode ? "inherit" : ""
                                            }`,
                                            paddingTop: 3,
                                          },
                                        }}
                                      />
                                    )}
                                  />
                                );
                              }}
                            />
                          </div> */}
                          <div className="col-span-12">
                            <FormLabel htmlFor={`description-${field.id}`}>
                              Version Description
                              <span className="text-red-600 font-bold ms-1">
                                *
                              </span>
                            </FormLabel>
                            <textarea
                              id={`description-${field.id}`}
                              name="description"
                              value={field.description}
                              onChange={(e) =>
                                handleDynamicInputChange(
                                  field.id,
                                  "description",
                                  e.target.value
                                )
                              }
                              className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200"
                              rows={4}
                            />
                            {dynamicFormErrors.find(
                              (error) => error.id === field.id
                            )?.description && (
                              <p className="mt-1 text-xs text-red-500">
                                {
                                  dynamicFormErrors.find(
                                    (error) => error.id === field.id
                                  )?.description
                                }
                              </p>
                            )}
                          </div>

                          <div className="col-span-12 flex justify-between">
                            {dynamicFields.length === 1 ? (
                              <Button
                                variant="primary"
                                type="button"
                                onClick={handleAddMoreFields}
                              >
                                Add More Fields
                              </Button>
                            ) : (
                              <React.Fragment>
                                {index < dynamicFields.length - 1 ? (
                                  <Button
                                    variant="primary"
                                    type="button"
                                    className="bg-red-600"
                                    onClick={() => handleRemoveField(field.id)}
                                  >
                                    Remove
                                  </Button>
                                ) : (
                                  <React.Fragment>
                                    <Button
                                      variant="primary"
                                      type="button"
                                      className="bg-red-600"
                                      onClick={() =>
                                        handleRemoveField(field.id)
                                      }
                                    >
                                      Remove
                                    </Button>
                                    <Button
                                      variant="primary"
                                      type="button"
                                      onClick={handleAddMoreFields}
                                    >
                                      Add More Fields
                                    </Button>
                                  </React.Fragment>
                                )}
                              </React.Fragment>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                )}

              {!initFormData.isRelease && (
                <div className="col-span-12 intro-y sm:col-span-12">
                  <FormLabel htmlFor="description">Page Description</FormLabel>
                  <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                    <ClassicEditor
                      id="description"
                      value={initFormData.description}
                      onChange={handleEditorChange}
                    />
                  </div>
                </div>
              )}

              <div className="col-span-6 intro-y sm:col-span-6">
                <FormLabel htmlFor="meta_tags">Meta Tags</FormLabel>
                <FormTextarea
                  id="meta_tags"
                  value={initFormData.meta_tags}
                  onInput={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    handleInputChange(e, "meta_tags")
                  }
                />
              </div>

              <div className="col-span-6 intro-y sm:col-span-6">
                <FormLabel htmlFor="meta_description">
                  Meta Description
                </FormLabel>
                <FormTextarea
                  id="meta_description"
                  value={initFormData.meta_description}
                  onInput={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    handleInputChange(e, "meta_description")
                  }
                />
              </div>

              <div className="flex items-center col-span-12 mt-5 intro-y">
                <Button variant="primary" type="submit" onClick={handleSubmit}>
                  {isLoading ? (
                    <>{cmsId ? "Updating Details" : "Adding Details"}</>
                  ) : (
                    <>{cmsId ? "Update Details" : "Add Details"}</>
                  )}
                </Button>

                <Button
                  variant="instagram"
                  className="ml-2"
                  type="button"
                  onClick={() => {
                    localStorage.removeItem("supports");
                    navigate("/cms");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Dialog open={isDeleteModalOpen} onClose={handleCancelDelete}>
        <DialogContent>
          <div className="p-5 text-center">
            <div className="mt-5">
              <h3 className="text-xl">
                Are you sure you want to delete this field?
              </h3>
            </div>
          </div>
          <div className="px-5 pb-8 text-center">
            <Button variant="danger" onClick={handleConfirmDelete}>
              Delete
            </Button>
            <Button
              variant="secondary"
              className="ml-2"
              onClick={handleCancelDelete}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddDetails;
