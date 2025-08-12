import React, { useState, ChangeEvent, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import { useNavigate } from "react-router-dom";
import {
  fetchAccountsDropsown,
  fetchAllCountries,
  fetchAllStates,
  fetchCompanyDropdown,
  fetchDriverDropdown,
} from "../../stores/commonList";
import {
  addUser,
  editUser,
  fetchSingleUser,
  getUsersData,
} from "../../stores/user";
import { validateUserInfo } from "../../utils/validations";
import { fetchAllRoles } from "../../stores/manageRole";
import { toast } from "react-toastify";
import AddUserFormJsx from "./AddUserFormJsx";
import {
  ErrorState,
  FormState,
  ImageState,
  SelectedRoleType,
  SelectState,
  TextInputState,
} from "../../types/User/addUserFormTypes";
import CustomLoader from "../Loader/CustomLoader";
import {
  ACCOUNT,
  ACCOUNT_STANDARD,
  COMPANY_ADMIN,
  COMPANY_STANDARD,
  DRIVER,
  SUCCESS_CODE,
} from "../../utils/constants";
import LoaderIcon from "../Loader/LoaderIcon";
import secureLocalStorage from "react-secure-storage";

const initialState = {
  name: "",
  profile_pic: "",
  building_name: "",
  street_address: "",
  country: "",
  state: "",
  city: "",
  email: "",
  password: "",
  pincode: "",
  contact_no: "",
  companySelect: "",
  driverSelect: "",
  accountsSelect: "",
  role: "",
  time_zone: "",
};

const AddUserForm: React.FC = () => {
  const [initFormData, setInitFormData] = useState<FormState>({
    ...initialState,
    profile_pic: null,
  });
  const [isCountrySelected, setIsCountrySelected] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
  const [isSelectLoading, setIsSelectLoading] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<ErrorState>>({});
  const { user }: any = useAppSelector(getUsersData);
  const [isRoleSelected, setIsRoleSelected] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<SelectedRoleType | null>(
    null
  );
  const navigate = useNavigate();
  const isUserAdded = secureLocalStorage.getItem("newlyAddedUser");
  const [selectErrors, setSelectErrors] = useState<{ [key: string]: string }>({
    country: "",
    state: "",
    companySelect: "",
    driverSelect: "",
    accountsSelect: "",
    role: "",
    time_zone: "",
  });
  const [profileImageError, setProfileImageError] = useState({
    profile_pic: "",
  });
  const [previewImage, setPreviewImage] = useState<ImageState>({
    profile_pic: null,
  });
  const [isImageUploaded, setIsImageUploaded] = useState<boolean>(false);

  useEffect(() => {
    dispatch(fetchAllCountries());
    dispatch(
      fetchAllRoles({
        type: "fordropdown",
      })
    );
    const fetchUserData = async () => {
      if (isUserAdded) {
        setIsDataLoaded(true);
        await dispatch(fetchSingleUser(Number(isUserAdded)));
        setIsDataLoaded(false);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const removeItemFromLocalStorage = () => {
      secureLocalStorage.removeItem("newlyAddedUser");
    };
    if (isUserAdded) {
      window.addEventListener("popstate", removeItemFromLocalStorage);

      return () => {
        window.removeEventListener("popstate", removeItemFromLocalStorage);
      };
    }
  }, [isUserAdded]);

  useEffect(() => {
    if (initFormData.country !== undefined) {
      if (initFormData.country !== "") {
        dispatch(
          fetchAllStates({
            country_id: Number(initFormData.country),
          })
        );
      }
    }
  }, [initFormData.country]);

  useEffect(() => {
    setIsFormValid(Object.keys(formErrors).length === 0);
  }, [formErrors]);

  useEffect(() => {
    if (selectedRole !== null) {
      const fetchData = async () => {
        try {
          setIsSelectLoading(true);
          if (
            selectedRole?.label === ACCOUNT.toLocaleUpperCase() ||
            selectedRole?.label === ACCOUNT_STANDARD.toLocaleUpperCase()
          ) {
            await dispatch(fetchAccountsDropsown());
          } else if (
            selectedRole?.label === COMPANY_ADMIN.toLocaleUpperCase() ||
            selectedRole?.label === COMPANY_STANDARD.toLocaleUpperCase()
          ) {
            await dispatch(fetchCompanyDropdown());
          } else if (selectedRole?.label === DRIVER.toLocaleUpperCase()) {
            await dispatch(fetchDriverDropdown({ type: "" }));
          }
        } catch (error) {
          console.log("Er-", error);
        } finally {
          setIsSelectLoading(false);
        }
      };

      fetchData();
    }
  }, [selectedRole]);

  useEffect(() => {
    if (user !== null && isUserAdded) {
      setIsRoleSelected(true);
      setIsCountrySelected(true);
      setInitFormData((prev) => ({
        ...prev,
        name: user.name || "",
        building_name: user.building_name || "",
        street_address: user.street_address || "",
        email: user.email || "",
        country: user.country,
        accountsSelect: user?.account_detail?.name
          ? user?.account_detail?.name
          : "",
        companySelect: user?.company_detail?.name
          ? user?.company_detail?.name
          : "",
        driverSelect: user?.driver_detail?.name
          ? user?.driver_detail?.name
          : "",
        role: user?.role?.role_name ? user.role.role_name : "",
        time_zone: user.time_zone ? user.time_zone : "",
        city: user.city || "",
        state: user.state,
        pincode: user.zipcode || "",
        contact_no: user.contact_no || "",
        profile_pic: user.profile_pic || null,
      }));
    }
  }, [user, isUserAdded]);

  const handleChange = (key: string, value: string) => {
    // const formData = new FormData(document.forms.userForm);
    const formData = new FormData(
      document.getElementById("userForm") as HTMLFormElement
    );
    formData.set(key, value);
    let errors = validateUserInfo(formData);
    setFormErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0);
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    fieldName: keyof TextInputState
  ) => {
    const { value } = event.target;
    setInitFormData((prevState) => ({ ...prevState, [fieldName]: value }));
    handleChange(fieldName, value);
  };

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>,
    fieldName: keyof TextInputState
  ) => {
    if (fieldName === "profile_pic") {
      const file = event.target.files?.[0];
      if (file) {
        const allowedExtensions = ["jpg", "jpeg", "png"];
        const fileExtension = file.name.split(".").pop()?.toLowerCase();

        if (
          fileExtension !== undefined &&
          allowedExtensions.includes(fileExtension)
        ) {
          setInitFormData((prevState) => ({
            ...prevState,
            ["profile_pic"]: file,
          }));
          setProfileImageError((prev) => ({
            ...prev,
            profile_pic: "",
          }));
          setIsImageUploaded(true);
        } else {
          setProfileImageError((prev) => ({
            ...prev,
            profile_pic: "Please Attach a valid image (jpg, jpeg, png)",
          }));
          setIsImageUploaded(false);
          setPreviewImage((prev) => ({ ...prev, profile_pic: null }));
        }
        const reader = new FileReader();
        reader.onload = (e) => {
          const imagePreviewUrl = e.target?.result as File | null;
          setPreviewImage((prev) => ({
            ...prev,
            profile_pic: imagePreviewUrl,
          }));
        };
        reader.readAsDataURL(file);
      } else {
        setInitFormData((prev) => ({
          ...prev,
          profile_pic: null,
        }));
        setPreviewImage((prev) => ({ ...prev, profile_pic: null }));
        setProfileImageError((prev) => ({
          ...prev,
          profile_pic: "",
        }));
        setIsImageUploaded(false);
      }
    }
  };

  const handleSelectChange = (
    selectedValue: string,
    fieldName: keyof SelectState
  ) => {
    setInitFormData((prevState) => ({
      ...prevState,
      [fieldName]: selectedValue,
    }));
    if (fieldName === "country") {
      setInitFormData((prevState) => ({
        ...prevState,
        state: "",
      }));
      if (!selectedValue) {
        setInitFormData((prevState) => ({
          ...prevState,
          state: "",
        }));
        setSelectErrors((prevErrors) => ({
          ...prevErrors,
          country: "Country is required",
        }));
      } else {
        setSelectErrors((prevErrors) => ({ ...prevErrors, country: "" }));
      }
    }
    if (fieldName === "state") {
      setSelectErrors((prevErrors) => ({
        ...prevErrors,
        state: selectedValue ? "" : "State is required",
      }));
    }
    if (fieldName === "role") {
      setInitFormData((prev) => ({
        ...prev,
        companySelect: "",
        accountsSelect: "",
        driverSelect: "",
      }));
      setSelectErrors((prevErrors) => ({
        ...prevErrors,
        role: selectedValue ? "" : "Please select Role.",
      }));
      // Clear errors when role changes
      setSelectErrors((prevErrors) => ({
        ...prevErrors,
        accountsSelect: "",
        companySelect: "",
        driverSelect: "",
      }));
    }
    if (fieldName === "accountsSelect") {
      setSelectErrors((prevErrors) => ({
        ...prevErrors,
        accountsSelect: selectedValue ? "" : "Please select Account.",
      }));
    }
    if (fieldName === "companySelect") {
      setSelectErrors((prevErrors) => ({
        ...prevErrors,
        companySelect: selectedValue ? "" : "Please select Company.",
      }));
    }
    if (fieldName === "driverSelect") {
      setSelectErrors((prevErrors) => ({
        ...prevErrors,
        driverSelect: selectedValue ? "" : "Please select Driver.",
      }));
    }
    if (fieldName === "time_zone") {
      setSelectErrors((prevErrors) => ({
        ...prevErrors,
        time_zone: selectedValue ? "" : "Time Zone is required",
      }));
    }
  };

  const submitUserInfo = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const errors = validateUserInfo(formData);
    if (isUserAdded) {
      delete errors.password;
    }
    setFormErrors(errors);
    const profilePicErrorExist = {
      profile_pic: "",
    };
    if (initFormData.profile_pic) {
      if (!isUserAdded || isImageUploaded) {
        const allowedExtensions = ["jpg", "jpeg", "png"];
        const fileExtension = (initFormData?.profile_pic as File)?.name
          ?.split(".")
          .pop()
          ?.toLowerCase();

        if (
          fileExtension !== undefined &&
          !allowedExtensions.includes(fileExtension)
        ) {
          profilePicErrorExist.profile_pic =
            "Please Attach a valid image (jpg, jpeg, png)";
        }
      } else {
        if (!isImageUploaded) {
          if (typeof initFormData.profile_pic === "string") {
            if (
              initFormData.profile_pic?.includes(".jpg") ||
              initFormData.profile_pic?.includes(".jpeg") ||
              initFormData.profile_pic?.includes(".png")
            ) {
              profilePicErrorExist.profile_pic = "";
            }
          }
        }
      }
    }
    setProfileImageError(profilePicErrorExist);
    const selecteErrorCheck = {
      country: "",
      state: "",
      time_zone: "",
      role: "",
      companySelect: "",
      driverSelect: "",
      accountsSelect: "",
    };
    if (!initFormData.country) {
      selecteErrorCheck.country = "Country is required";
    }
    if (!initFormData.state) {
      selecteErrorCheck.state = "State is required";
    }
    if (!initFormData.time_zone) {
      selecteErrorCheck.time_zone = "Time Zone is required";
    }
    if (!initFormData.role) {
      selecteErrorCheck.role = "Role is required";
    }
    if (selectedRole !== null) {
      if (
        (selectedRole.label === COMPANY_ADMIN.toLocaleUpperCase() ||
          selectedRole.label === COMPANY_STANDARD.toLocaleUpperCase()) &&
        !initFormData.companySelect
      ) {
        initFormData.accountsSelect = "";
        selecteErrorCheck.companySelect = "Company is required";
        selecteErrorCheck.driverSelect = "";
        selecteErrorCheck.accountsSelect = "";
      }
      if (
        selectedRole.label === DRIVER.toLocaleUpperCase() &&
        !initFormData.driverSelect
      ) {
        initFormData.accountsSelect = "";
        selecteErrorCheck.companySelect = "";
        selecteErrorCheck.driverSelect = "Driver is required";
        selecteErrorCheck.accountsSelect = "";
      }
      if (
        (selectedRole.label === ACCOUNT.toLocaleUpperCase() ||
          selectedRole.label === ACCOUNT_STANDARD.toLocaleUpperCase()) &&
        !initFormData.accountsSelect
      ) {
        initFormData.companySelect = "";
        selecteErrorCheck.companySelect = "";
        selecteErrorCheck.driverSelect = "";
        selecteErrorCheck.accountsSelect = "Account is required";
      }
    }
    setSelectErrors(selecteErrorCheck);
    if (
      Object.values(selecteErrorCheck).some((error) => error !== "") ||
      Object.keys(errors).length > 0 ||
      profilePicErrorExist.profile_pic
    ) {
      return;
    } else {
      const payload = {
        name: initFormData.name,
        email: initFormData.email.toLocaleLowerCase(),
        country: initFormData.country,
        building_name: initFormData.building_name,
        street_address: initFormData.street_address,
        state: initFormData.state,
        city: initFormData.city,
        zipcode: initFormData.pincode,
        contact_no: initFormData.contact_no,
        ...(!isUserAdded && {
          account_id: initFormData.accountsSelect
            ? initFormData.accountsSelect
            : null,
        }),
        ...(!isUserAdded && {
          role_id: initFormData.role,
        }),
        ...(!isUserAdded && {
          company_id: initFormData.companySelect
            ? initFormData.companySelect
            : null,
        }),
        ...(!isUserAdded && {
          driver_id: initFormData.driverSelect
            ? initFormData.driverSelect
            : null,
        }),
        time_zone: initFormData.time_zone,
        profile_pic: initFormData.profile_pic,
        ...(!isUserAdded && { password: initFormData.password }),
      };
      if (isUserAdded) {
        try {
          setIsLoading(true);
          const res = await dispatch(editUser({ ...payload, id: isUserAdded }));
          if (res.payload?.status === SUCCESS_CODE) {
            toast.success(
              res.payload.data?.message || "User updated successfully"
            );
            secureLocalStorage.removeItem("newlyAddedUser");
            navigate("/user");
          } else {
            return toast.error(
              res.payload?.response?.data?.message || "Something went wrong"
            );
          }
        } catch (error) {
          console.log("Err--", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        try {
          setIsLoading(true);
          const res = await dispatch(addUser(payload));
          if (res.payload?.status === SUCCESS_CODE) {
            toast.success(
              res.payload.data?.message ||
                "User added successful. Verification email sent to verify the email.."
            );
            navigate("/user");
          } else {
            return toast.error(
              res.payload?.response?.data?.message || "Something went wrong"
            );
          }
        } catch (error) {
          console.log("Err-", error);
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  return (
    <>
      {isDataLoaded ? (
        <CustomLoader color="fill-green-600" />
      ) : (
        <>
          {isSelectLoading && (
            <LoaderIcon icon="oval" customClass="!pt-[200px] z-50" />
          )}
          <form
            className="grid grid-cols-12 gap-4 mt-3"
            onSubmit={submitUserInfo}
            name="userForm"
            id="userForm"
          >
            <AddUserFormJsx
              formErrors={formErrors}
              handleImageChange={handleImageChange}
              handleInputChange={handleInputChange}
              handleSelectChange={handleSelectChange}
              initFormData={initFormData}
              isCountrySelected={isCountrySelected}
              isLoading={isLoading}
              isRoleSelected={isRoleSelected}
              setIsRoleSelected={setIsRoleSelected}
              previewImage={previewImage}
              profileImageError={profileImageError}
              selectErrors={selectErrors}
              setIsCountrySelected={setIsCountrySelected}
              selectedRole={selectedRole}
              setSelectedRole={setSelectedRole}
            />
          </form>
        </>
      )}
    </>
  );
};

export default AddUserForm;
