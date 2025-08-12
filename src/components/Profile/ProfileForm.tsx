import React, { useState, ChangeEvent, useEffect } from "react";
import { FormInput, FormLabel } from "../../base-components/Form";
import clsx from "clsx";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import Button from "../../base-components/Button";
import { useNavigate } from "react-router-dom";
import { getUserData, setLoginUserData } from "../../stores/dashboard";
import Lucide from "../../base-components/Lucide";
import LoadingIcon from "../../base-components/LoadingIcon";
import { toast } from "react-toastify";
import { updateUserProfile } from "../../stores/user";
import { USERNAME_REGEX } from "../../utils/constants";
import secureLocalStorage from "react-secure-storage";
import LoaderIcon from "../Loader/LoaderIcon";

const initialState = {
  name: "",
  password: "",
};

type TextInputState = {
  name: string;
  password: string;
};

type FormState = TextInputState;

type ErrorState = {
  name: string;
};

const ProfileForm: React.FC = () => {
  const [initFormData, setInitFormData] = useState<FormState>({
    ...initialState,
  });
  const userState: any = useAppSelector(getUserData);
  const [formErrors, setFormErrors] = useState<ErrorState>({
    name: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isProfileDataLoading, setIsProfileDataLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsProfileDataLoading(true);
        await dispatch(setLoginUserData());
      } catch (error) {
        console.log("Err-", error);
      } finally {
        setIsProfileDataLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  useEffect(() => {
    if (userState.user !== null) {
      setInitFormData((prev) => ({
        ...prev,
        name: userState.user.name || "",
      }));
    }
  }, [userState.user]);
  const navigate = useNavigate();

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
    setInitFormData((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };

  const submitUserInfo = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errors: { name: string } = { name: "" };
    if (initFormData.name === "") {
      errors.name = "Name is required";
      setFormErrors(errors);
    }
    if (errors.name) return;
    try {
      setIsLoading(true);
      const payload = {
        name: initFormData.name,
        ...(initFormData.password && { password: initFormData.password }),
      };
      const res = await dispatch(updateUserProfile(payload));
      if (res.payload.data === undefined)
        return toast.error("Something went wrong");
      secureLocalStorage.setItem("username", JSON.stringify(payload.name));
      toast.success(res.payload.data?.message || "User updated successfully");
      navigate("/dashboard");
    } catch (error) {
      console.log("Err--", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isProfileDataLoading ? (
        <LoaderIcon icon="oval" customClass="pt-6" />
      ) : (
        <form className="grid grid-cols-12 gap-4" onSubmit={submitUserInfo}>
          <div className="col-span-12 intro-y sm:col-span-6">
            <FormLabel htmlFor="input-wizard-1">
              Profile Name <span className="text-red-600 font-bold">*</span>
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
              autoComplete="name"
              aria-autocomplete="inline"
              placeholder="Enter Name"
              value={initFormData.name}
            />
            {formErrors.name && (
              <div className="mt-2 text-xs sm:text-sm text-danger dark:text-red-500">
                {typeof formErrors.name === "string" && formErrors.name}
              </div>
            )}
          </div>
          <div className="col-span-12 intro-y sm:col-span-6">
            <FormLabel htmlFor="input-wizard-2">Password</FormLabel>
            <FormInput
              id="input-wizard-2"
              type={showPassword ? "text" : "password"}
              name="password"
              onInput={(e: ChangeEvent<HTMLInputElement>) =>
                handleInputChange(e, "password")
              }
              placeholder="Enter Password"
              value={initFormData.password}
            />
            <div
              className={`absolute inset-y-0 right-2 flex items-center cursor-pointer mt-7`}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <Lucide icon="EyeOff" className="h-5 w-5 text-gray-500" />
              ) : (
                <Lucide icon="Eye" className="h-5 w-5 text-gray-500" />
              )}
            </div>
          </div>
          <div className="col-span-12 sm:col-span-6 intro-y">
            <FormLabel
              htmlFor="input-wizard-1"
              className="flex justify-between"
            >
              <span>Email</span>
            </FormLabel>
            <section className="font-bold mt-3">
              {userState?.user?.email}
            </section>
          </div>
          {userState?.user?.company_id && (
            <div className="col-span-12 sm:col-span-6 intro-y">
              <FormLabel
                htmlFor="input-wizard-1"
                className="flex justify-between"
              >
                <span>Company</span>
              </FormLabel>
              <section className="font-bold uppercase mt-3">
                {userState?.user?.company_name}
              </section>
            </div>
          )}

          {userState?.user?.account_name && (
            <div className="col-span-12 sm:col-span-6 intro-y">
              <FormLabel
                htmlFor="input-wizard-1"
                className="flex justify-between"
              >
                <span>Account</span>
              </FormLabel>
              <section className="font-bold uppercase mt-3">
                {userState.user.account_name}
              </section>
            </div>
          )}

          <div className="col-span-12 sm:col-span-6 intro-y">
            <FormLabel
              htmlFor="input-wizard-1"
              className="flex justify-between"
            >
              <span>Role</span>
            </FormLabel>
            <section className="font-bold uppercase mt-3">
              {userState?.user?.role?.role_name}
            </section>
          </div>

          <div className="flex items-center col-span-12 mt-5 gap-5 intro-y">
            <Button
              variant="primary"
              type="submit"
              disabled={formErrors.name || isLoading ? true : false}
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
                "Update User"
              )}
            </Button>
            <Button
              variant="secondary"
              className="px-7 text-xs sm:text-sm"
              type="button"
              onClick={() => navigate("/dashboard")}
            >
              Exit
            </Button>
          </div>
        </form>
      )}
    </>
  );
};

export default ProfileForm;
