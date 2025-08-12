import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import Button from "../../base-components/Button";
import { Dialog } from "../../base-components/Headless";
import {
  FormLabel,
  FormSwitch,
  FormTextarea,
} from "../../base-components/Form";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import {
  fetchAllRoles,
  fetchSingleRole,
  getRolesData,
  updateSingleRole,
} from "../../stores/manageRole";
import Loader from "../Loader";
import LoadingIcon from "../../base-components/LoadingIcon";
import { toast } from "react-toastify";
import { SUCCESS_CODE } from "../../utils/constants";

interface EditRoleProps {
  editModal: boolean;
  setEditModal: (role: boolean) => void;
  editModalId: number;
}

const initialState = {
  role_name: "",
  role_description: "",
};

type TextInputState = {
  role_name: string;
  role_description: string;
};

const EditRoleModal: React.FC<EditRoleProps> = ({
  editModal,
  setEditModal,
  editModalId,
}) => {
  const [formData, setFormData] = useState<TextInputState>({
    ...initialState,
  });
  const addRoleButtonRef = useRef(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
  const [switchvalue, setSwitchValue] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState({ role_name: "" });
  const dispatch = useAppDispatch();
  const { role }: any = useAppSelector(getRolesData);

  useEffect(() => {
    const fetchRoleData = async () => {
      if (editModal) {
        setIsDataLoaded(true);
        await dispatch(fetchSingleRole(editModalId));
        setIsDataLoaded(false);
        if (formErrors.role_name) {
          setFormErrors((prev) => ({
            ...prev,
            role_name: "",
          }));
        }
      }
    };
    fetchRoleData();
  }, [editModal]);

  useEffect(() => {
    if (role !== null) {
      setFormData((prev) => ({
        ...prev,
        role_name: role?.role_name || "",
        role_description: role?.role_description || "",
      }));
      setSwitchValue(role?.enable === 0 ? false : true);
    }
  }, [role]);

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
      role_name: value ? "" : "Module Name is required",
    }));
  };

  const handleSwitchChange = () => {
    setSwitchValue(!switchvalue);
  };

  const handleCloseModal = () => {
    setEditModal(false);
    setFormData(initialState);
  };

  const submitInfo = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors: { role_name: string } = {
      role_name: "",
    };
    if (!formData.role_name) {
      errors.role_name = "Role Name is required";
    } else if (formData.role_name.trim().length === 0) {
      errors.role_name = "Role Name cannot be whitespace only";
    }
    if (errors.role_name !== "") {
      setFormErrors(errors);
      return;
    }
    try {
      if (formData.role_name !== "") {
        const payload = {
          ...formData,
          enable: switchvalue === true ? 1 : 0,
          id: editModalId,
        };
        setIsLoading(true);
        const res = await dispatch(updateSingleRole(payload));
        if (res.payload?.status === SUCCESS_CODE) {
          toast.success(res.payload.data.message || "Role updated");
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
      console.log("Er--", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog
        open={editModal}
        onClose={handleCloseModal}
        initialFocus={addRoleButtonRef}
      >
        <Dialog.Panel>
          <div className="px-5 py-3 text-center">
            <div className="text-lg sm:text-2xl mt-5 font-semibold">
              Edit Role
            </div>
          </div>
          {role === null || isDataLoaded ? (
            <Loader icon="puff" />
          ) : (
            <form className="mt-3 px-5 pb-5" onSubmit={submitInfo}>
              <div className="flex flex-wrap intro-y gap-5 sm:gap-10">
                <div className="flex gap-4 intro-y">
                  <span>Role : </span>
                  <section className="font-bold uppercase">
                    {formData.role_name}
                  </section>
                </div>
                <div className="flex items-center gap-5">
                  <FormLabel htmlFor="input-wizard-2">Enable</FormLabel>
                  <FormSwitch>
                    <FormSwitch.Input
                      id="input-wizard-2"
                      type="checkbox"
                      className="shadow-xl border-slate-300 -mt-2"
                      checked={switchvalue}
                      onChange={handleSwitchChange}
                    />
                  </FormSwitch>
                </div>
              </div>
              <div className="col-span-12 intro-y mt-5">
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
                  ref={addRoleButtonRef}
                  disabled={formErrors.role_name || isLoading ? true : false}
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
                    "Update Role"
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

export default EditRoleModal;
