import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useAppDispatch } from "../../stores/hooks";
import { toast } from "react-toastify";
import { Dialog } from "../../base-components/Headless";
import { FormInput, FormLabel, FormSwitch } from "../../base-components/Form";
import clsx from "clsx";
import Button from "../../base-components/Button";
import LoadingIcon from "../../base-components/LoadingIcon";
import { addModule, fetchAllModules } from "../../stores/module";
import { SUCCESS_CODE } from "../../utils/constants";

interface AddModuleProps {
  addModal: boolean;
  setAddModal: React.Dispatch<React.SetStateAction<boolean>>;
  limit: number;
  currentPage: number;
  searchText: string;
  setFilterModule: React.Dispatch<React.SetStateAction<string>>;
}

const initialState = {
  name: "",
  enable: true,
  admin: true,
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

const AddModuleModal: React.FC<AddModuleProps> = ({
  addModal,
  currentPage,
  limit,
  searchText,
  setAddModal,
  setFilterModule,
}) => {
  const addButtonRef = useRef(null);
  const [formData, setFormData] = useState<TextInputState>({
    ...initialState,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({ name: "" });

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (addModal && formErrors.name) {
      setFormErrors((prev) => ({
        ...prev,
        name: "",
      }));
    }
  }, [addModal]);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    fieldName: keyof TextInputState
  ) => {
    const { value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: value.trimStart(),
    }));
    // if (!NAME_REGEX.test(value)) {
    //   setFormErrors((prev) => ({
    //     ...prev,
    //     name: "Module Name can only contain alphabets",
    //   }));
    // } else {
    // }
    setFormErrors((prev) => ({
      ...prev,
      name: value ? "" : "Module Name is required",
    }));
  };

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
    setAddModal(false);
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
    if (errors.name) {
      setFormErrors(errors);
      return;
    }
    try {
      setIsLoading(true);
      const payload = {
        name: formData.name,
        enable: formData.enable ? 1 : 0,
        superadmin_access: formData.admin ? 1 : 0,
      };
      const res = await dispatch(addModule(payload));
      if (res.payload?.status === SUCCESS_CODE) {
        toast.success(
          res.payload.data?.message || "Module created successfully"
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
    } catch (error) {
      console.log("Error--", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog
        open={addModal}
        onClose={handleCloseModal}
        initialFocus={addButtonRef}
      >
        <Dialog.Panel>
          <div className="px-5 py-3 text-center">
            <div className="text-lg sm:text-2xl mt-5 font-semibold">
              Add Module
            </div>
          </div>
          <form
            className="grid grid-cols-12 gap-4 mt-3 px-5 pb-5"
            onSubmit={submitInfo}
          >
            <div className="col-span-12 intro-y sm:col-span-6">
              <FormLabel htmlFor="input-wizard-1">
                Module Name <span className="text-red-600 font-bold">*</span>
              </FormLabel>
              <FormInput
                id="input-wizard-1"
                type="text"
                name="name"
                className={clsx({
                  "border-danger dark:border-red-500": formErrors.name,
                })}
                onInput={(e: ChangeEvent<HTMLInputElement>) =>
                  handleInputChange(e, "name")
                }
                minLength={3}
                maxLength={50}
                placeholder="Module Name"
                value={formData.name}
              />
              {formErrors.name && (
                <div className="mt-2 text-xs sm:text-sm text-danger dark:text-red-500">
                  {typeof formErrors.name === "string" && formErrors.name}
                </div>
              )}
            </div>
            <div
              className={`flex items-center sm:ml-7 gap-5 sm:mt-7 ${
                formErrors.name && "sm:mb-7"
              }`}
            >
              <FormLabel htmlFor="input-wizard-2" className="mt-2">
                Enable
              </FormLabel>
              <FormSwitch>
                <FormSwitch.Input
                  id="checkbox-switch-1"
                  type="checkbox"
                  className="shadow-xl border-slate-300"
                  checked={formData.enable}
                  onChange={(e) => handleSwitchChange(e, "enable")}
                />
              </FormSwitch>
            </div>
            <div className={`col-span-12 flex items-center gap-4`}>
              <FormLabel htmlFor="input-wizard-3" className="mt-2">
                Accessible to Admin only
              </FormLabel>
              <FormSwitch>
                <FormSwitch.Input
                  id="checkbox-switch-2"
                  type="checkbox"
                  checked={formData.admin}
                  className="shadow-xl border-slate-300"
                  onChange={(e) => handleSwitchChange(e, "admin")}
                />
              </FormSwitch>
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
                ref={addButtonRef}
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
                  "Add Module"
                )}
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </Dialog>
    </>
  );
};

export default AddModuleModal;
