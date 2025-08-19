import React, { useState, ChangeEvent, useEffect } from "react";
import { FormInput, FormLabel } from "../../base-components/Form";
import clsx from "clsx";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import Button from "../../base-components/Button";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAdminData,
  fetchSingleAdmin,
  updateAdmin,
  addAdmin
} from "../../stores/admin";
import LoadingIcon from "../../base-components/LoadingIcon";
import { toast } from "react-toastify";
import { USERNAME_REGEX } from "../../utils/constants";
import secureLocalStorage from "react-secure-storage";
import LoaderIcon from "../../components/Loader/LoaderIcon";

const initialState = {
  id: null,
  name: "",
  email: "",
  phone: "",
  password: "",
  is_enabled: 1,
};

type TextInputState = {
  id: number | null;
  name: string;
  email: string;
  phone: string;
  password: string;
  is_enabled: number;
};

type FormState = TextInputState;

type ErrorState = {
  name: string;
  phone: string;
  email?: string;
  password?: string;
};

const ManageAdmin: React.FC = () => {
  const [initFormData, setInitFormData] = useState<FormState>({
    ...initialState,
  });
  const adminState: any = useAppSelector(getAdminData);
  const [formErrors, setFormErrors] = useState<ErrorState>({
    name: "",
    phone: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isProfileDataLoading, setIsProfileDataLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (!id) {
      return;
    }
    const fetchAdminData = async () => {
      try {
        setIsProfileDataLoading(true);
        await dispatch(fetchSingleAdmin(Number(id)));
      } catch (error) {
        console.log("Err-", error);
      } finally {
        setIsProfileDataLoading(false);
      }
    };
    fetchAdminData();
  }, [id]);

  useEffect(() => {
    if (!adminState?.admin || !id) {
      return;
    }
    if (
      adminState?.admin?.name !== null ||
      adminState?.admin?.phone !== null ||
      adminState?.admin?.email !== null
    ) {
      setInitFormData((prev) => ({
        ...prev,
        id: adminState?.admin?.id,
        name: adminState?.admin?.name || "",
        phone: adminState?.admin?.phone || "",
        email: adminState?.admin?.email || "",
      }));
    }
  }, [adminState?.admin?.name, adminState?.admin?.phone, adminState?.admin?.email, id]);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    fieldName: keyof TextInputState
  ) => {
    const { value } = event.target;
    if (fieldName === "name") {
      setFormErrors((prev) => ({
        ...prev,
        name: value ? "" : "Name is required",
      }));
      if (!USERNAME_REGEX.test(value)) {
        setFormErrors((prev) => ({
          ...prev,
          name: "Invalid Name",
        }));
      }
    }
    if (fieldName === "phone") {
      setFormErrors((prev) => ({
        ...prev,
        phone: value ? "" : "Phone number is required",
      }));
    }
    if (!id && fieldName === "email") {
      setFormErrors((prev) => ({
        ...prev,
        email: value ? "" : "Email is required",
      }));
    }
    if (!id && fieldName === "password") {
      setFormErrors((prev) => ({
        ...prev,
        password: value ? "" : "Password is required",
      }));
    }
    setInitFormData((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };

  const submitUserInfo = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Add mode: all fields required. Update mode: only name and phone required.
    const errors: {
      name: string;
      phone: string;
      email?: string;
      password?: string;
    } = { name: "", phone: "" };
    if (initFormData.name === "") {
      errors.name = "Name is required";
    }
    if (initFormData.phone === "") {
      errors.phone = "Phone number is required";
    }
    if (!id) {
      // Add mode: validate all fields
      if (initFormData.email === "") {
        errors.email = "Email is required";
      }
      if (initFormData.password === "") {
        errors.password = "Password is required";
      }
    }
    setFormErrors(errors as ErrorState);
    if (
      errors.name ||
      errors.phone ||
      (!id && (errors.email || errors.password))
    )
      return;
    try {
      setIsLoading(true);
      const payload = {
        name: initFormData.name,
        phone: initFormData.phone,
        email: initFormData.email,
        password: initFormData.password,
        ...(id && { id: initFormData.id })
      };
      let res;
      if(id) {
          res = await dispatch(updateAdmin(payload));
        } else {
        res = await dispatch(addAdmin(payload));
      }
      if (res.payload.data === undefined)
        return toast.error("Something went wrong");
      toast.success(
        res.payload.data?.message ||
          `Admin ${id ? "updated" : "added"} successfully`
      );
      navigate("/admins");
    } catch (error) {
      console.log("Err--", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isProfileDataLoading && id ? (
        <LoaderIcon icon="oval" customClass="pt-6" />
      ) : (
        <form
          className="w-full mx-auto p-6 bg-white rounded shadow mt-7 dark:bg-darkmode-800"
          onSubmit={submitUserInfo}
        >
          <h2 className="text-lg font-semibold mb-6">
            {id ? "Edit Admin Details" : "Add Admin Details"}
          </h2>

          {/* Name */}
          <div className="mb-4">
            <label htmlFor="name" className="block mb-1 font-medium">
              Name
            </label>
            <FormInput
              id="name"
              type="text"
              name="name"
              placeholder="John Smith"
              className={clsx("w-full", {
                "border-danger dark:border-red-500": formErrors.name,
              })}
              onInput={(e: ChangeEvent<HTMLInputElement>) =>
                handleInputChange(e, "name")
              }
              value={initFormData.name}
            />
            {formErrors.name && (
              <p className="mt-1 text-xs text-red-500">{formErrors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block mb-1 font-medium">
              Email
            </label>
            <FormInput
              id="email"
              type="email"
              name="email"
              placeholder="abc@yahoo.com"
              value={initFormData.email}
              className={clsx("w-full", {
                "border-danger dark:border-red-500": !id && formErrors.email,
              })}
              onInput={(e: ChangeEvent<HTMLInputElement>) =>
                handleInputChange(e, "email")
              }
              disabled={!!id}
            />
            {!id && formErrors.email && (
              <p className="mt-1 text-xs text-red-500">{formErrors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label htmlFor="password" className="block mb-1 font-medium">
              Password
            </label>
            <FormInput
              id="password"
              type="password"
              name="password"
              placeholder="Password"
              value={initFormData.password}
              onInput={(e: ChangeEvent<HTMLInputElement>) =>
                handleInputChange(e, "password")
              }
              className={clsx("w-full", {
                "border-danger dark:border-red-500": !id && formErrors.password,
              })}
            />
            {!id && formErrors.password && (
              <p className="mt-1 text-xs text-red-500">{formErrors.password}</p>
            )}
          </div>

          {/* Phone No */}
          <div className="mb-4">
            <label htmlFor="phone" className="block mb-1 font-medium">
              Phone No.
            </label>
            <FormInput
              id="phone"
              type="text"
              name="phone"
              placeholder="Enter Phone Number"
              value={initFormData.phone}
              onInput={(e: ChangeEvent<HTMLInputElement>) =>
                handleInputChange(e, "phone")
              }
              className={clsx("w-full", {
                "border-danger dark:border-red-500": formErrors.phone,
              })}
            />
            {formErrors.phone && (
              <p className="mt-1 text-xs text-red-500">{formErrors.phone}</p>
            )}
          </div>

          {/* Enable Checkbox */}
          <div className="mb-4 flex items-center">
            <FormInput
              id="enable"
              type="checkbox"
              name="enable"
              checked={initFormData.is_enabled ? true : false}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setInitFormData((prev) => ({
                  ...prev,
                  is_enabled: e.target.checked ? 1 : 0,
                }))
              }
              className="mr-2 w-4"
            />
            <label htmlFor="enable" className="font-medium">
              Enable
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              variant="primary"
              type="submit"
              disabled={
                isLoading ||
                formErrors.name ||
                formErrors.phone ||
                (!id && (formErrors.email || formErrors.password))
                  ? true
                  : false
              }
              className="px-6"
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
                "Submit"
              )}
            </Button>
            <Button
              variant="secondary"
              type="button"
              onClick={() => navigate("/dashboard")}
              className="px-6"
            >
              Back
            </Button>
          </div>
        </form>
      )}
    </>
  );
};

export default ManageAdmin;
