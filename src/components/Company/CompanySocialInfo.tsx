import React, { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import Button from "../../base-components/Button";
import { FormInput, FormLabel } from "../../base-components/Form";
import { useNavigate } from "react-router-dom";
import {
  editCompany,
  fetchSingleCompany,
  getCompaniesData,
} from "../../stores/company";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import LoadingIcon from "../../base-components/LoadingIcon";
import { toast } from "react-toastify";
import { COMPANY_BASIC_DETAIL, SUCCESS_CODE } from "../../utils/constants";
import CustomLoader from "../Loader/CustomLoader";
import { openImageInNewTab } from "../../utils/helper";
import secureLocalStorage from "react-secure-storage";

interface StepTwoProps {
  setPage?: (page: string) => void;
  nextPage: (page: string) => void;
}

type PreviewState = {
  image: File | null;
  bgImage: File | null;
};

const initialState = {
  facebookUrl: "",
  faq: "",
  googleUrl: "",
  instagramUrl: "",
  youtubeUrl: "",
  snapchatUrl: "",
  tiktokUrl: "",
  footerCopyright: "",
  domain: "",
  contact_us_link: "",
};

type TextInputState = {
  facebookUrl: string;
  faq: string;
  googleUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  snapchatUrl: string;
  tiktokUrl: string;
  footerCopyright: string;
  domain: string;
  contact_us_link: string;
};

const CompanySocialInfo: React.FC<StepTwoProps> = ({ nextPage, setPage }) => {
  const [formData, setFormData] = useState<TextInputState>({
    ...initialState,
  });
  const [formErrors, setFormErrors] = useState({
    image: "",
    bgImage: "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedBgImage, setSelectedBgImage] = useState<File | string | null>(
    null
  );
  const [previewImage, setPreviewImage] = useState<PreviewState>({
    image: null,
    bgImage: null,
  });
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
  const [isLoadingExit, setIsLoadingExit] = useState<boolean>(false);
  const isCompanyAdded = secureLocalStorage.getItem("newlyAddedCompany");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { company }: any = useAppSelector(getCompaniesData);

  useEffect(() => {
    const fetchCompanySocialInfo = async () => {
      if (isCompanyAdded) {
        setIsDataLoaded(true);
        await dispatch(
          fetchSingleCompany({
            id: isCompanyAdded as any,
            type: COMPANY_BASIC_DETAIL,
          })
        );
        setIsDataLoaded(false);
      }
    };
    fetchCompanySocialInfo();
  }, [isCompanyAdded]);

  useEffect(() => {
    const removeItemFromLocalStorage = () => {
      secureLocalStorage.removeItem("newlyAddedCompany");
      secureLocalStorage.removeItem("companyPage");
    };
    if (isCompanyAdded || secureLocalStorage.getItem("companyPage")) {
      window.addEventListener("popstate", removeItemFromLocalStorage);

      return () => {
        window.removeEventListener("popstate", removeItemFromLocalStorage);
      };
    }
  }, [isCompanyAdded]);

  useEffect(() => {
    if (company !== null && isCompanyAdded) {
      setFormData((prev) => ({
        ...prev,
        facebookUrl: company.facebook || "",
        faq: company.faq || "",
        googleUrl: company.google_plus || "",
        instagramUrl: company.instagram || "",
        youtubeUrl: company.youtube || "",
        snapchatUrl: company.snapchat || "",
        tiktokUrl: company.tiktok || "",
        footerCopyright: company.copy_right_text || "",
        domain: company.company_domain || "",
        contact_us_link: company.contact_us_link || "",
      }));
      setSelectedImage(company.logo || "");
      setSelectedBgImage(company.background_photo || "");
    }
  }, [company, isCompanyAdded]);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    fieldName: keyof TextInputState
  ) => {
    const { value } = event.target;
    setFormData((prevState) => ({ ...prevState, [fieldName]: value }));
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedExtensions = ["jpg", "jpeg", "png"];
      const fileExtension = file.name.split(".").pop()?.toLowerCase();

      if (
        fileExtension !== undefined &&
        allowedExtensions.includes(fileExtension)
      ) {
        setSelectedImage(file);
        setFormErrors((prev) => ({
          ...prev,
          image: "",
        }));
      } else {
        setFormErrors((prev) => ({
          ...prev,
          image: "Please Attach a valid image (jpg, jpeg, png)",
        }));
        setPreviewImage((prev) => ({ ...prev, image: null }));
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imagePreviewUrl = e.target?.result as File | null;
        setPreviewImage((prev) => ({
          ...prev,
          image: imagePreviewUrl,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedImage(null);
      setFormErrors((prev) => ({
        ...prev,
        image: "Company Logo is required",
      }));
      setPreviewImage((prev) => ({ ...prev, image: null }));
    }
  };

  const handleBgImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedExtensions = ["jpg", "jpeg", "png"];
      const fileExtension = file.name.split(".").pop()?.toLowerCase();

      if (
        fileExtension !== undefined &&
        allowedExtensions.includes(fileExtension)
      ) {
        setSelectedBgImage(file);
        setFormErrors((prev) => ({
          ...prev,
          bgImage: "",
        }));
        setIsImageUploaded(true);
      } else {
        setFormErrors((prev) => ({
          ...prev,
          bgImage: "Please Attach a valid image (jpg, jpeg, png)",
        }));
        setIsImageUploaded(false);
        setPreviewImage((prev) => ({ ...prev, bgImage: null }));
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imagePreviewUrl = e.target?.result as File | null;
        setPreviewImage((prev) => ({
          ...prev,
          bgImage: imagePreviewUrl,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedBgImage(null);
      setPreviewImage((prev) => ({ ...prev, bgImage: null }));
      setFormErrors((prev) => ({ ...prev, bgImage: "" }));
      setIsImageUploaded(false);
    }
  };

  const submitCompanySocialInfo = async (
    e: React.ChangeEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const checkImageError = {
      image: "",
      bgImage: "",
    };
    if (selectedBgImage) {
      if (isImageUploaded) {
        const allowedExtensions = ["jpg", "jpeg", "png"];
        const fileExtension = (selectedBgImage as File).name
          ?.split(".")
          .pop()
          ?.toLowerCase();

        if (
          fileExtension !== undefined &&
          !allowedExtensions.includes(fileExtension)
        ) {
          checkImageError.bgImage =
            "Please Attach a valid image (jpg, jpeg, png)";
        }
      } else {
        if (typeof selectedBgImage === "string") {
          if (
            selectedBgImage?.includes(".jpg") ||
            selectedBgImage?.includes(".jpeg") ||
            selectedBgImage?.includes(".png")
          ) {
            checkImageError.bgImage = "";
          }
        }
      }
    }
    if (!selectedImage) {
      checkImageError.image = "Please Attach a valid image (jpg, jpeg, png)";
    }
    setFormErrors(checkImageError);
    if (checkImageError.bgImage || checkImageError.image) {
      return;
    } else {
      const payload = {
        logo: selectedImage,
        bg_photo: selectedBgImage,
        facebook: formData.facebookUrl || "",
        faq: formData.faq || "",
        google_plus: formData.googleUrl || "",
        instagram: formData.instagramUrl || "",
        youtube: formData.youtubeUrl || "",
        snapchat: formData.snapchatUrl || "",
        tiktok: formData.tiktokUrl || "",
        copy_right_text: formData.footerCopyright || "",
        company_domain: formData.domain || "",
        id: isCompanyAdded ? isCompanyAdded : "",
        contact_us_link: formData.contact_us_link,
      };
      try {
        if (isCompanyAdded) {
          setIsLoading(true);
          const res = await dispatch(editCompany(payload));
          if (res.payload?.status === SUCCESS_CODE) {
            toast.success(
              res.payload.data.message || "Company updated successfully"
            );
            setPage?.("3");
          } else {
            return toast.error(
              res.payload?.response?.data?.message || "Something went wrong"
            );
          }
        }
      } catch (error) {
        console.log("Error-", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const saveAndExitCompany = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const checkImageError = {
      image: "",
      bgImage: "",
    };
    if (selectedBgImage) {
      if (isImageUploaded) {
        const allowedExtensions = ["jpg", "jpeg", "png"];
        const fileExtension = (selectedBgImage as File).name
          ?.split(".")
          .pop()
          ?.toLowerCase();

        if (
          fileExtension !== undefined &&
          !allowedExtensions.includes(fileExtension)
        ) {
          checkImageError.bgImage =
            "Please Attach a valid image (jpg, jpeg, png)";
        }
      } else {
        if (typeof selectedBgImage === "string") {
          if (
            selectedBgImage?.includes(".jpg") ||
            selectedBgImage?.includes(".jpeg") ||
            selectedBgImage?.includes(".png")
          ) {
            checkImageError.bgImage = "";
          }
        }
      }
    }
    if (!selectedImage) {
      checkImageError.image = "Please Attach a valid image (jpg, jpeg, png)";
    }
    setFormErrors(checkImageError);
    if (checkImageError.bgImage || checkImageError.image) {
      return;
    } else {
      const payload = {
        logo: selectedImage,
        bg_photo: selectedBgImage,
        facebook: formData.facebookUrl || "",
        faq: formData.faq || "",
        google_plus: formData.googleUrl || "",
        instagram: formData.instagramUrl || "",
        youtube: formData.youtubeUrl || "",
        snapchat: formData.snapchatUrl || "",
        tiktok: formData.tiktokUrl || "",
        copy_right_text: formData.footerCopyright || "",
        company_domain: formData.domain || "",
        contact_us_link: formData.contact_us_link || "",
        id: isCompanyAdded ? isCompanyAdded : "",
      };
      try {
        if (isCompanyAdded) {
          setIsLoadingExit(true);
          const res = await dispatch(editCompany(payload));
          if (res.payload?.status === SUCCESS_CODE) {
            toast.success(
              res.payload.data.message || "Company updated successfully"
            );
            secureLocalStorage.removeItem("newlyAddedCompany");
            secureLocalStorage.removeItem("companyPage");
            navigate("/company");
          } else {
            return toast.error(
              res.payload?.response?.data?.message || "Something went wrong"
            );
          }
        }
      } catch (error) {
        console.log("Error-", error);
      } finally {
        setIsLoadingExit(false);
      }
    }
  };

  return (
    <>
      {isDataLoaded ? (
        <CustomLoader color="fill-emerald-600" />
      ) : (
        <form
          className="grid grid-cols-12 gap-4 mt-3"
          onSubmit={submitCompanySocialInfo}
        >
          <div
            className={`col-span-12 intro-y sm:col-span-6 md:col-span-4 flex flex-col justify-center`}
          >
            <FormLabel className="flex gap-5" htmlFor="input-wizard-logo">
              <div>
                Logo <span className="text-red-600 font-bold">*</span>
              </div>
              {Object.keys(previewImage).length > 0 &&
              previewImage.image !== null &&
              typeof selectedImage === "object" ? (
                <div className="w-9 h-9 image-fit -mt-5 shadow-lg">
                  <img
                    alt="Preview"
                    className="rounded-full cursor-pointer"
                    src={String(previewImage.image)}
                  />
                </div>
              ) : (
                <>
                  {typeof selectedImage === "string" && selectedImage && (
                    <div className="w-9 h-9 image-fit -mt-5 shadow-lg">
                      <img
                        alt="Logo"
                        className="rounded-full cursor-pointer"
                        src={`${
                          import.meta.env.VITE_REACT_APP_COMPANY_IMAGE_URL
                        }/${selectedImage}`}
                        onClick={() =>
                          openImageInNewTab(
                            `${
                              import.meta.env.VITE_REACT_APP_COMPANY_IMAGE_URL
                            }/${selectedImage}`
                          )
                        }
                      />
                    </div>
                  )}
                </>
              )}
            </FormLabel>
            <FormInput
              id="input-wizard-logo"
              className={`py-[0.3rem] border border-slate-200 px-3 ${
                formErrors.image && "border-danger dark:!border-red-500"
              }`}
              type="file"
              onChange={handleImageChange}
            />
            {formErrors.image && (
              <div className="mt-2 text-xs sm:text-sm text-danger dark:text-red-500">
                {typeof formErrors.image === "string" && formErrors.image}
              </div>
            )}
          </div>
          <div
            className={`col-span-12 intro-y sm:col-span-6 md:col-span-4 flex flex-col justify-center`}
          >
            <FormLabel className="flex gap-5" htmlFor="input-wizard-bgImage">
              Background Image
              {Object.keys(previewImage).length > 0 &&
              previewImage.bgImage !== null &&
              typeof selectedBgImage === "object" ? (
                <div className="w-9 h-9 image-fit -mt-5 shadow-lg">
                  <img
                    alt="Preview"
                    className="rounded-full cursor-pointer"
                    src={String(previewImage.bgImage)}
                  />
                </div>
              ) : (
                <>
                  {typeof selectedBgImage === "string" && selectedBgImage && (
                    <div className="w-9 h-9 image-fit -mt-5 shadow-lg">
                      <img
                        alt="Logo"
                        className="rounded-full cursor-pointer"
                        src={`${
                          import.meta.env.VITE_REACT_APP_COMPANY_IMAGE_URL
                        }/${selectedBgImage}`}
                        onClick={() =>
                          openImageInNewTab(
                            `${
                              import.meta.env.VITE_REACT_APP_COMPANY_IMAGE_URL
                            }/${selectedBgImage}`
                          )
                        }
                      />
                    </div>
                  )}
                </>
              )}
            </FormLabel>
            <FormInput
              id="input-wizard-bgImage"
              className={`py-[0.3rem] border border-slate-200 px-3 ${
                formErrors.bgImage && "border-danger dark:!border-red-500"
              }`}
              type="file"
              onChange={handleBgImageChange}
            />
            {formErrors.bgImage && (
              <div className="mt-2 text-xs sm:text-sm text-danger dark:text-red-500">
                {typeof formErrors.bgImage === "string" && formErrors.bgImage}
              </div>
            )}
          </div>
          <div className="col-span-12 intro-y sm:col-span-6 md:col-span-4">
            <FormLabel htmlFor="input-wizard-2">Facebook URL</FormLabel>
            <FormInput
              id="input-wizard-2"
              type="url"
              placeholder="Enter Facebook URL"
              name="facebookUrl"
              onInput={(e: ChangeEvent<HTMLInputElement>) =>
                handleInputChange(e, "facebookUrl")
              }
              value={formData.facebookUrl}
            />
          </div>
          <div className="col-span-12 intro-y sm:col-span-6 md:col-span-4">
            <FormLabel htmlFor="input-wizard-3">FAQ</FormLabel>
            <FormInput
              id="input-wizard-3"
              type="url"
              placeholder="Enter FAQ"
              name="faq"
              onInput={(e: ChangeEvent<HTMLInputElement>) =>
                handleInputChange(e, "faq")
              }
              value={formData.faq}
            />
          </div>
          <div className="col-span-12 intro-y sm:col-span-6 md:col-span-4">
            <FormLabel htmlFor="input-wizard-4">Google Plus URL</FormLabel>
            <FormInput
              id="input-wizard-4"
              type="url"
              placeholder="Enter Google Plus URL"
              name="googleUrl"
              onInput={(e: ChangeEvent<HTMLInputElement>) =>
                handleInputChange(e, "googleUrl")
              }
              value={formData.googleUrl}
            />
          </div>
          <div className="col-span-12 intro-y sm:col-span-6 md:col-span-4">
            <FormLabel htmlFor="input-wizard-5">Instagram URL</FormLabel>
            <FormInput
              id="input-wizard-5"
              type="url"
              placeholder="Enter Instagram URL"
              name="instagramUrl"
              onInput={(e: ChangeEvent<HTMLInputElement>) =>
                handleInputChange(e, "instagramUrl")
              }
              value={formData.instagramUrl}
            />
          </div>
          <div className="col-span-12 intro-y sm:col-span-6 md:col-span-4">
            <FormLabel htmlFor="input-wizard-6">Youtube URL</FormLabel>
            <FormInput
              id="input-wizard-6"
              type="url"
              placeholder="Enter Youtube URL"
              name="youtubeUrl"
              onInput={(e: ChangeEvent<HTMLInputElement>) =>
                handleInputChange(e, "youtubeUrl")
              }
              value={formData.youtubeUrl}
            />
          </div>
          <div className="col-span-12 intro-y sm:col-span-6 md:col-span-4">
            <FormLabel htmlFor="input-wizard-7">Snapchat URL</FormLabel>
            <FormInput
              id="input-wizard-7"
              type="url"
              placeholder="Enter Snapchat URL"
              name="snapchatUrl"
              onInput={(e: ChangeEvent<HTMLInputElement>) =>
                handleInputChange(e, "snapchatUrl")
              }
              value={formData.snapchatUrl}
            />
          </div>
          <div className="col-span-12 intro-y sm:col-span-6 md:col-span-4">
            <FormLabel htmlFor="input-wizard-8">Tiktok URL</FormLabel>
            <FormInput
              id="input-wizard-8"
              type="url"
              placeholder="Enter Tiktok URL"
              name="tiktokUrl"
              onInput={(e: ChangeEvent<HTMLInputElement>) =>
                handleInputChange(e, "tiktokUrl")
              }
              value={formData.tiktokUrl}
            />
          </div>
          <div className="col-span-12 intro-y sm:col-span-6 md:col-span-4">
            <FormLabel htmlFor="input-wizard-9">Footer Copyright</FormLabel>
            <FormInput
              id="input-wizard-9"
              type="text"
              placeholder="Enter Footer Copyright"
              name="footerCopyright"
              onInput={(e: ChangeEvent<HTMLInputElement>) =>
                handleInputChange(e, "footerCopyright")
              }
              value={formData.footerCopyright}
            />
          </div>
          <div className="col-span-12 intro-y sm:col-span-6 md:col-span-4">
            <FormLabel htmlFor="input-wizard-12">Company Website</FormLabel>
            <FormInput
              id="input-wizard-12"
              type="text"
              name="domain"
              onInput={(e: ChangeEvent<HTMLInputElement>) =>
                handleInputChange(e, "domain")
              }
              placeholder="Enter Company Website"
              value={formData.domain}
            />
          </div>
          <div className="col-span-12 intro-y sm:col-span-6 md:col-span-4">
            <FormLabel htmlFor="input-wizard-13">Contact Us</FormLabel>
            <FormInput
              id="input-wizard-13"
              type="url"
              name="contact_us_link"
              onInput={(e: ChangeEvent<HTMLInputElement>) =>
                handleInputChange(e, "contact_us_link")
              }
              placeholder="Contact Us Link"
              value={formData.contact_us_link}
            />
          </div>
          <div className="flex justify-center items-center col-span-12 mt-3 intro-y sm:justify-end">
            <Button
              variant="secondary"
              className="text-xs"
              onClick={() => setPage?.("1")}
              type="button"
            >
              Previous
            </Button>
            <Button
              variant="primary"
              className="ml-2 text-xs"
              type="button"
              onClick={saveAndExitCompany}
              disabled={
                formErrors.image || formErrors.bgImage || isLoadingExit
                  ? true
                  : false
              }
            >
              {isLoadingExit ? (
                <>
                  Save & Exit
                  <LoadingIcon
                    icon="oval"
                    color="white"
                    className="w-4 h-4 ml-2"
                  />
                </>
              ) : (
                "Save & Exit"
              )}
            </Button>
            <Button
              variant="primary"
              className="ml-2 text-xs"
              type="submit"
              disabled={
                formErrors.image || formErrors.bgImage || isLoading
                  ? true
                  : false
              }
            >
              {isLoading ? (
                <>
                  Next
                  <LoadingIcon
                    icon="oval"
                    color="white"
                    className="w-4 h-4 ml-2"
                  />
                </>
              ) : (
                "Next"
              )}
            </Button>
          </div>
        </form>
      )}
    </>
  );
};

export default CompanySocialInfo;
