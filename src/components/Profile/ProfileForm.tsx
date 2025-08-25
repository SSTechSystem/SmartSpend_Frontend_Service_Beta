import React, { useState, ChangeEvent, useEffect } from "react";
import { FormInput, FormLabel } from "../../base-components/Form";
import clsx from "clsx";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import Button from "../../base-components/Button";
import { useNavigate } from "react-router-dom";
import { getProfileData, setProfileData } from "../../stores/profile";
import LoadingIcon from "../../base-components/LoadingIcon";
import { toast } from "react-toastify";
import { updateProfile } from "../../stores/profile";
import { SUCCESS_CODE, USERNAME_REGEX } from "../../utils/constants";
import secureLocalStorage from "react-secure-storage";
import LoaderIcon from "../Loader/LoaderIcon";

const initialState = {
  id: null,
  name: "",
  email: "",
  phone: "",
};

type TextInputState = {
  id: number | null;
  name: string;
  email: string;
  phone: string;
};

type FormState = TextInputState;

type ErrorState = {
  name: string;
  phone: string;
};

const ProfileForm: React.FC = () => {
  const [initFormData, setInitFormData] = useState<FormState>({
    ...initialState,
  });
  const profileState: any = useAppSelector(getProfileData);
  const [formErrors, setFormErrors] = useState<ErrorState>({
    name: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isProfileDataLoading, setIsProfileDataLoading] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsProfileDataLoading(true);
        await dispatch(setProfileData());
      } catch (error) {
        console.log("Err-", error);
      } finally {
        setIsProfileDataLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  useEffect(() => {
    if (profileState.name !== null || profileState.phone !== null || profileState.email !== null) {
      setInitFormData((prev) => ({
        ...prev,
        name: profileState.name || "",
        phone: profileState.phone || "",
        email: profileState.email || "",
      }));
    }
  }, [profileState.name,profileState.phone,profileState.email]);
  const navigate = useNavigate();

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    fieldName: keyof TextInputState
  ) => {
    const { value } = event.target;
    if (fieldName === "name") {
      setFormErrors((prev) => ({
        ...prev,
        name: value.trim() ? "" : "Name is required",
      }));
      if (!USERNAME_REGEX.test(value)) {
        setFormErrors((prev) => ({
          ...prev,
          name: "Invalid Name",
        }));
      }
      if(value.length > 35) {
        setFormErrors((prev) => ({
          ...prev,
          name: "Name must be less than 35 characters",
        }));
      }
    }
    if(fieldName === 'phone') {
      setFormErrors((prev) => ({
        ...prev,
        phone: value ? "" : "Phone number is required",
      }));
      if(value.length > 12 || value.length < 10) {
        setFormErrors((prev) => ({
          ...prev,
          phone: "Phone number must be between 10 to 12 digits",
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
    const errors: { name: string, phone: string } = { name: "", phone: "" };
    if (initFormData.name === "") {
      errors.name = "Name is required";
    }
    if (initFormData.phone === "") {
      errors.phone = "Phone number is required";
    }
    setFormErrors(errors);
    if (errors.name || errors.phone) return;
    try {
      setIsLoading(true);
      const payload = {
        name: initFormData.name,
        phone: initFormData.phone,
        email: initFormData.email
      };
      const res = await dispatch(updateProfile(payload));
      if (res?.payload?.status === SUCCESS_CODE) {
        secureLocalStorage.setItem("username",payload.name);
        navigate("/dashboard");
        toast.success(res.payload.data?.message || "Your profile has been updated successfully.");
      } else {
        return toast.error(res?.payload?.response?.data?.message);
      }
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
            <FormLabel htmlFor="input-wizard-2">Email</FormLabel>
            <FormInput
              id="input-wizard-2"
              name="email"
              value={initFormData.email}
              readOnly
            />
          </div>
          <div className="col-span-12 intro-y sm:col-span-6">
            <FormLabel htmlFor="input-wizard-1">
              Phone <span className="text-red-600 font-bold">*</span>
            </FormLabel>
            <FormInput
              id="input-wizard-1"
              type="text"
              name="phone"
              className={clsx({
                "border-danger dark:border-red-500": formErrors.phone,
              })}
              onInput={(e: ChangeEvent<HTMLInputElement>) =>
                handleInputChange(e, "phone")
              }
              autoComplete="phone"
              aria-autocomplete="inline"
              placeholder="Enter Phone Number"
              value={initFormData.phone}
            />
            {formErrors.phone && (
              <div className="mt-2 text-xs sm:text-sm text-danger dark:text-red-500">
                {typeof formErrors.phone === "string" && formErrors.phone}
              </div>
            )}
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
