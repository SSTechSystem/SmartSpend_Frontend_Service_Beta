import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import { toast } from "react-toastify";
import { Dialog } from "../../base-components/Headless";
import Loader from "../Loader";
import { FormLabel, FormSwitch } from "../../base-components/Form";
import Button from "../../base-components/Button";
import LoadingIcon from "../../base-components/LoadingIcon";
import {
  editModule,
  fetchAllModules,
  fetchSingleModule,
  getSingleModuleData,
} from "../../stores/module";
import { SUCCESS_CODE } from "../../utils/constants";

interface EditModuleProps {
  editModal: boolean;
  setEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  editModalId: number | null;
  limit: number;
  currentPage: number;
  searchText: string;
  setFilterModule: React.Dispatch<React.SetStateAction<string>>;
}

const initialState = {
  name: "",
  enable: true,
  admin: false,
};

type TextInputState = {
  name: string;
  enable: boolean;
  admin: boolean;
};

type SwitchState = {
  enable: boolean;
  admin: boolean;
};

const EditModuleModal: React.FC<EditModuleProps> = ({
  editModal,
  editModalId,
  currentPage,
  limit,
  searchText,
  setEditModal,
  setFilterModule,
}) => {
  const [formData, setFormData] = useState<TextInputState>({
    ...initialState,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [formErrors, setFormErrors] = useState({ name: "" });
  const dispatch = useAppDispatch();
  const module = useAppSelector(getSingleModuleData);

  useEffect(() => {
    const fetchModuleData = async () => {
      if (editModal) {
        setIsDataLoaded(true);
        await dispatch(fetchSingleModule(Number(editModalId)));
        setIsDataLoaded(false);
        if (formErrors.name) {
          setFormErrors((prev) => ({
            ...prev,
            name: "",
          }));
        }
      }
    };
    fetchModuleData();
  }, [editModal]);

  useEffect(() => {
    if (module !== null) {
      setFormData((prev) => ({
        ...prev,
        name: module?.name || "",
        admin: Boolean(module?.superadmin_access),
        enable: module?.enable === 0 ? false : true,
      }));
    }
  }, [module]);

  // const handleInputChange = (
  //   event: ChangeEvent<HTMLInputElement>,
  //   fieldName: keyof TextInputState
  // ) => {
  //   const { value } = event.target;
  //   setFormData((prevState) => ({
  //     ...prevState,
  //     [fieldName]: value.trimStart(),
  //   }));
  //   if (!NAME_REGEX.test(value)) {
  //     setFormErrors((prev) => ({
  //       ...prev,
  //       name: "Module Name can only contain alphabets",
  //     }));
  //   } else {
  //     setFormErrors((prev) => ({
  //       ...prev,
  //       name: value ? "" : "Module Name is required",
  //     }));
  //   }
  // };

  const handleSwitchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    fieldName: keyof SwitchState
  ) => {
    const { checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [fieldName]: checked,
    }));
  };

  const handleCloseModal = () => {
    setEditModal(false);
    setFormData(initialState);
  };

  const submitInfo = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors = { name: "" };
    if (!formData.name) {
      errors.name = "Module Name is required";
    } else if (formData.name.trim().length === 0) {
      errors.name = "Module Name cannot be whitespace only";
    }
    if (errors.name !== "") {
      setFormErrors(errors);
      return;
    }
    try {
      if (formData.name !== "") {
        const payload = {
          name: formData.name,
          enable: formData.enable ? 1 : 0,
          superadmin_access: formData.admin,
          id: editModalId,
        };
        setIsLoading(true);
        const res = await dispatch(editModule(payload));
        if (res.payload?.status === SUCCESS_CODE) {
          toast.success(
            res.payload.data?.message || "Module updated successfully"
          );
          await dispatch(
            fetchAllModules({ limit, page: currentPage, searchText })
          );
          setFilterModule("all");
          handleCloseModal();
        } else {
          return toast.error(
            res.payload.response?.data?.message || "Something went wrong"
          );
        }
      }
    } catch (error) {
      console.log("Er--", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={editModal} onClose={handleCloseModal}>
        <Dialog.Panel>
          <div className="px-5 py-3 text-center">
            <div className="text-lg sm:text-2xl mt-5 font-semibold">
              Edit Module
            </div>
          </div>
          {module === null || isDataLoaded ? (
            <Loader icon="puff" />
          ) : (
            <form className="mt-3 px-5 pb-5" onSubmit={submitInfo}>
              {/* <div className="col-span-12 intro-y sm:col-span-6">
                <FormLabel htmlFor="input-wizard-1">
                  Module Name <span className="font-bold text-red-600">*</span>
                </FormLabel>
                <FormInput
                  id="input-wizard-1"
                  type="text"
                  name="name"
                  value={formData.name}
                  onInput={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(e, "name")
                  }
                  required
                  disabled
                  placeholder="Module Name"
                />
                {formErrors.name && (
                  <div className="mt-2 text-danger dark:text-red-500">
                    {typeof formErrors.name === "string" && formErrors.name}
                  </div>
                )}
              </div> */}
              <div className="flex gap-4 intro-y">
                <FormLabel htmlFor="input-wizard-1">
                  <span>Module : </span>
                </FormLabel>
                <section className="font-bold uppercase">
                  {formData.name}
                </section>
              </div>
              <div className="flex flex-wrap intro-y gap-5 mt-5">
                <div className="flex items-center gap-5">
                  <FormLabel htmlFor="input-wizard-2">Enable</FormLabel>
                  <FormSwitch>
                    <FormSwitch.Input
                      id="checkbox-switch-1"
                      type="checkbox"
                      className="shadow-xl border-slate-300 -mt-2"
                      checked={formData.enable}
                      onChange={(e) => handleSwitchChange(e, "enable")}
                    />
                  </FormSwitch>
                </div>
                <div className={`col-span-12 flex items-center gap-4`}>
                  <FormLabel htmlFor="input-wizard-3">
                    Accessible to Admin only
                  </FormLabel>
                  <FormSwitch>
                    <FormSwitch.Input
                      id="checkbox-switch-2"
                      type="checkbox"
                      className="shadow-xl border-slate-300 -mt-2"
                      checked={formData.admin}
                      onChange={(e) => handleSwitchChange(e, "admin")}
                    />
                  </FormSwitch>
                </div>
              </div>
              <div className="flex items-center gap-3 justify-end col-span-12 mt-5">
                <Button
                  variant="instagram"
                  type="button"
                  onClick={handleCloseModal}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={formErrors.name || isLoading ? true : false}
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
                    "Update Module"
                  )}
                </Button>
              </div>
            </form>
          )}
        </Dialog.Panel>
      </Dialog>
    </>
  );
};

export default EditModuleModal;
