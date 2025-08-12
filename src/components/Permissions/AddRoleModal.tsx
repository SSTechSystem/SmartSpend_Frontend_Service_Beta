import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import Button from "../../base-components/Button";
import { Dialog } from "../../base-components/Headless";
import {
  FormInput,
  FormLabel,
  FormSwitch,
  FormTextarea,
} from "../../base-components/Form";
import clsx from "clsx";
import { useAppDispatch } from "../../stores/hooks";
import { addRole, fetchAllRoles } from "../../stores/manageRole";
import LoadingIcon from "../../base-components/LoadingIcon";
import { toast } from "react-toastify";
import { SUCCESS_CODE } from "../../utils/constants";

interface AddRoleProps {
  addModal: boolean;
  setAddModal: (role: boolean) => void;
}

const initialState = {
  role_name: "",
  enable: true,
  role_description: "",
};

type TextInputState = {
  role_name: string;
  enable: boolean;
  role_description: string;
};

const AddRoleModal: React.FC<AddRoleProps> = ({ addModal, setAddModal }) => {
  const addRoleButtonRef = useRef(null);
  const [formData, setFormData] = useState<TextInputState>({
    ...initialState,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState({ role_name: "" });

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (addModal && formErrors.role_name) {
      setFormErrors((prev) => ({
        ...prev,
        role_name: "",
      }));
    }
  }, [addModal]);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    fieldName: keyof TextInputState
  ) => {
    const { value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [fieldName]: value.trimStart(),
    }));
    setFormErrors((prev) => ({
      ...prev,
      role_name: value ? "" : "Role Name is required",
    }));
  };

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    setFormData((prevState) => ({ ...prevState, enable: checked }));
  };

  const handleCloseModal = () => {
    setAddModal(false);
    setFormData(initialState);
  };

  const submitInfo = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors = {
      role_name: "",
    };
    if (!formData.role_name) {
      errors.role_name = "Role Name is required";
    } else if (formData.role_name.trim().length === 0) {
      errors.role_name = "Role Name cannot be whitespace only";
    }
    if (errors.role_name) {
      setFormErrors(errors);
      return;
    }
    try {
      if (formData.role_name !== "") {
        setIsLoading(true);
        const payload = {
          ...formData,
          enable: formData.enable ? 1 : 0,
        };
        const res = await dispatch(addRole(payload));
        if (res.payload?.status === SUCCESS_CODE) {
          toast.success(res.payload.data.message || "Role created");
          await dispatch(
            fetchAllRoles({
              type: "forlistingpage",
            })
          );
          handleCloseModal();
        } else {
          return toast.error(
            res.payload?.response?.data?.message || "Something went wrong"
          );
        }
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
        initialFocus={addRoleButtonRef}
      >
        <Dialog.Panel>
          <div className="px-5 py-3 text-center">
            <div className="text-lg sm:text-2xl mt-5 font-semibold">
              Add Role
            </div>
          </div>
          <form
            className="grid grid-cols-12 gap-4 mt-3 px-5 pb-5"
            onSubmit={submitInfo}
          >
            <div className="col-span-12 intro-y sm:col-span-6">
              <FormLabel htmlFor="input-wizard-1">
                Role Name <span className="text-red-600 font-bold">*</span>
              </FormLabel>
              <FormInput
                id="input-wizard-1"
                type="text"
                name="role_name"
                className={clsx({
                  "border-danger dark:!border-red-500": formErrors.role_name,
                })}
                onInput={(e: ChangeEvent<HTMLInputElement>) =>
                  handleInputChange(e, "role_name")
                }
                minLength={3}
                maxLength={50}
                placeholder="Role Name"
                value={formData.role_name}
              />
              {formErrors.role_name && (
                <div className="mt-2 text-xs sm:text-sm text-danger dark:text-red-500">
                  {typeof formErrors.role_name === "string" &&
                    formErrors.role_name}
                </div>
              )}
            </div>
            <div
              className={`flex items-center sm:ml-7 gap-5 sm:mt-7 ${
                formErrors.role_name && "sm:mb-7"
              }`}
            >
              <FormLabel htmlFor="input-wizard-2" className="mt-2">
                Enable
              </FormLabel>
              <FormSwitch>
                <FormSwitch.Input
                  id="input-wizard-2"
                  type="checkbox"
                  className="shadow-xl border-slate-300"
                  checked={formData.enable}
                  onChange={handleSwitchChange}
                />
              </FormSwitch>
            </div>
            <div className="col-span-12 intro-y">
              <FormLabel htmlFor="input-wizard-3">Role Description</FormLabel>
              <FormTextarea
                id="input-wizard-3"
                name="role_description"
                onInput={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  handleInputChange(e, "role_description")
                }
                placeholder="Enter Description For Role"
                value={formData.role_description}
                maxLength={150}
              />
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
                disabled={formErrors.role_name || isLoading ? true : false}
                ref={addRoleButtonRef}
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
                  "Add Role"
                )}
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </Dialog>
    </>
  );
};

export default AddRoleModal;
