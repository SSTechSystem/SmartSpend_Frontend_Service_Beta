import React, { useState, ChangeEvent, useEffect } from "react";
import { FormCheck, FormInput, FormLabel } from "../../base-components/Form";
import clsx from "clsx";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import Button from "../../base-components/Button";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAdminData,
  fetchSingleAdmin,
  updateAdmin,
  addAdmin,
} from "../../stores/admin";
import LoadingIcon from "../../base-components/LoadingIcon";
import { toast } from "react-toastify";
import {
  EMAIL_REGEX,
  SUCCESS_CODE,
  USERNAME_REGEX,
} from "../../utils/constants";
import LoaderIcon from "../../components/Loader/LoaderIcon";
import BackButton from "../../components/BackButton";

const initialState = {
  id: null,
  name: "",
  email: "",
  phone: "",
  password: "",
  is_enable: 1,
};

type TextInputState = {
  id: number | null;
  name: string;
  email: string;
  phone: string;
  password: string;
  is_enable: number;
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
        is_enable: adminState?.admin?.enable ?? 1,
      }));
    }
  }, [
    adminState?.admin?.name,
    adminState?.admin?.phone,
    adminState?.admin?.email,
    adminState?.admin?.enable,
    id,
  ]);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    fieldName: keyof TextInputState
  ) => {
    let value: any;
    if (fieldName === "is_enable") {
      value = event.target.checked ? 1 : 0;
    } else {
      value = event.target.value;
    }

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
      if (value.length > 35) {
        setFormErrors((prev) => ({
          ...prev,
          name: "Name must be less than 35 characters",
        }));
      }
    }
    if (fieldName === "phone") {
      setFormErrors((prev) => ({
        ...prev,
        phone: value ? "" : "Phone number is required",
      }));
      if (value.length > 12 || value.length < 10) {
        setFormErrors((prev) => ({
          ...prev,
          phone: "Phone number must be between 10 to 12 digits",
        }));
      }
    }
    if (!id && fieldName === "email") {
      setFormErrors((prev) => ({
        ...prev,
        email: value ? "" : "Email is required",
      }));
      if (!EMAIL_REGEX.test(value)) {
        setFormErrors((prev) => ({
          ...prev,
          email: "Invalid Email Format",
        }));
      }
    }
    if (!id && fieldName === "password") {
      setFormErrors((prev) => ({
        ...prev,
        password: value.trim() ? "" : "Password is required",
      }));
      if (value.length > 12 || value.length < 6) {
        setFormErrors((prev) => ({
          ...prev,
          password: "Password must be between 6 to 12 characters",
        }));
      }
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
        is_enable: initFormData.is_enable,
        ...(id && { id: initFormData.id }),
      };
      let res;
      if (id) {
        res = await dispatch(updateAdmin(payload));
      } else {
        res = await dispatch(addAdmin(payload));
      }
      if (res?.payload?.status === SUCCESS_CODE) {
        toast.success(
          res.payload?.data?.message ||
            `New admin ${id ? "updated" : "added"} successfully`
        );
        navigate("/admins");
      } else {
        toast.error(
          res.payload?.response?.data?.message ||
            `Error in ${id ? "updating" : "adding"} admin`
        );
      }
    } catch (error) {
      console.log("Err--", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="py-5 mt-5 intro-y box">
        <div className="px-5 sm:px-20">
          <BackButton
            to="/admins"
            variant="linkedin"
            title={`${id ? "Update" : "Add"} Admin`}
          />
          {isProfileDataLoading && id ? (
            <LoaderIcon icon="oval" customClass="pt-6" />
          ) : (
            <>
              <form
                className="grid grid-cols-12 gap-4 mt-5 gap-y-5"
                onSubmit={submitUserInfo}
              >
                <div className="col-span-12 intro-y sm:col-span-6">
                  <FormLabel htmlFor="name">
                    Profile Name{" "}
                    <span className="text-red-600 font-bold">*</span>
                  </FormLabel>
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
                    <p className="mt-1 text-xs text-red-500">
                      {formErrors.name}
                    </p>
                  )}
                </div>

                <div className="col-span-12 intro-y sm:col-span-6">
                  <FormLabel htmlFor="email">
                    Email <span className="text-red-600 font-bold">*</span>
                  </FormLabel>
                  <FormInput
                    id="email"
                    type="email"
                    name="email"
                    placeholder="abc@yahoo.com"
                    value={initFormData.email}
                    className={clsx("w-full", {
                      "border-danger dark:border-red-500":
                        !id && formErrors.email,
                    })}
                    onInput={(e: ChangeEvent<HTMLInputElement>) =>
                      handleInputChange(e, "email")
                    }
                    disabled={!!id}
                  />
                  {!id && formErrors.email && (
                    <p className="mt-1 text-xs text-red-500">
                      {formErrors.email}
                    </p>
                  )}
                </div>

                <div className="col-span-12 intro-y sm:col-span-6">
                  <FormLabel htmlFor="password">
                    Password <span className="text-red-600 font-bold">*</span>
                  </FormLabel>
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
                      "border-danger dark:border-red-500":
                        !id && formErrors.password,
                    })}
                  />
                  {!id && formErrors.password && (
                    <p className="mt-1 text-xs text-red-500">
                      {formErrors.password}
                    </p>
                  )}
                </div>

                <div className="col-span-12 intro-y sm:col-span-6">
                  <FormLabel htmlFor="phone">
                    Phone No. <span className="text-red-600 font-bold">*</span>
                  </FormLabel>
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
                    <p className="mt-1 text-xs text-red-500">
                      {formErrors.phone}
                    </p>
                  )}
                </div>

                <div className="col-span-12 intro-y sm:col-span-6">
                  <FormLabel htmlFor="is_enable">Enable</FormLabel>
                  <FormCheck>
                    <FormCheck.Input
                      id="is_enable"
                      type="checkbox"
                      name="is_enable"
                      checked={initFormData.is_enable === 1 ? true : false}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleInputChange(e, "is_enable")
                      }
                    />
                  </FormCheck>
                </div>

                {/* Buttons */}
                <div className="flex items-center col-span-12 mt-5 gap-5 intro-y">
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
                    className="text-xs sm:text-sm"
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
                    className="px-7 text-xs sm:text-sm"
                    type="button"
                    onClick={() => navigate("/admins")}
                  >
                    Exit
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ManageAdmin;
