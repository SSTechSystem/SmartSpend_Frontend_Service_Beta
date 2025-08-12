import React, { ChangeEvent, useEffect, useState } from "react";
import { FormInput, FormLabel } from "../../base-components/Form";
import Button from "../../base-components/Button";
import {
  editAccount,
  fetchSingleAccount,
  getAccountsData,
} from "../../stores/accounts";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import { useNavigate } from "react-router-dom";
import LoadingIcon from "../../base-components/LoadingIcon";
import { toast } from "react-toastify";
import CustomLoader from "../Loader/CustomLoader";
import { openImageInNewTab } from "../../utils/helper";
import { SUCCESS_CODE } from "../../utils/constants";
import secureLocalStorage from "react-secure-storage";

interface StepTwoProps {
  setPage?: (page: string) => void;
  nextPage: (page: string) => void;
}

const initialState = {
  facebookUrl: "",
  twitterUrl: "",
  googleUrl: "",
  instagramUrl: "",
  youtubeUrl: "",
  snapchatUrl: "",
  tiktokUrl: "",
  footerCopyright: "",
};

type TextInputState = {
  facebookUrl: string;
  twitterUrl: string;
  googleUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  snapchatUrl: string;
  tiktokUrl: string;
  footerCopyright: string;
};

const AccountsSocialInfo: React.FC<StepTwoProps> = ({ nextPage, setPage }) => {
  const [formData, setFormData] = useState<TextInputState>({
    ...initialState,
  });
  const [selectedImage, setSelectedImage] = useState<File | string | null>(
    null
  );
  const [previewImage, setPreviewImage] = useState<{
    selectedImage: string | null;
  }>({
    selectedImage: null,
  });
  const [profileImageError, setProfileImageError] = useState({
    logo: "",
  });
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const dispatch = useAppDispatch();
  const isAccountsAdded = secureLocalStorage.getItem("newlyAddedAccounts");
  const { account }: any = useAppSelector(getAccountsData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAccountSocialInfo = async () => {
      if (isAccountsAdded) {
        setIsDataLoaded(true);
        await dispatch(fetchSingleAccount(Number(isAccountsAdded)));
        setIsDataLoaded(false);
      }
    };
    fetchAccountSocialInfo();
  }, [isAccountsAdded]);

  useEffect(() => {
    const removeItemFromLocalStorage = () => {
      secureLocalStorage.removeItem("newlyAddedAccounts");
      secureLocalStorage.removeItem("accountPage");
    };
    if (isAccountsAdded || secureLocalStorage.getItem("accountPage")) {
      window.addEventListener("popstate", removeItemFromLocalStorage);

      return () => {
        window.removeEventListener("popstate", removeItemFromLocalStorage);
      };
    }
  }, [isAccountsAdded]);

  useEffect(() => {
    if (account !== null && isAccountsAdded) {
      setFormData((prev) => ({
        ...prev,
        facebookUrl: account.facebook_url || "",
        twitterUrl: account.twitter_url || "",
        googleUrl: account.googleplus_url || "",
        instagramUrl: account.instagram_url || "",
        youtubeUrl: account.youtube_url || "",
        snapchatUrl: account.snapchat_url || "",
        tiktokUrl: account.tiktok_url || "",
        footerCopyright: account.footer_copyright || "",
      }));
      setSelectedImage(account.logo || "");
    }
  }, [account, isAccountsAdded]);

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
        setProfileImageError((prev) => ({
          ...prev,
          logo: "",
        }));
        setIsImageUploaded(true);
      } else {
        setProfileImageError((prev) => ({
          ...prev,
          logo: "Please Attach a valid image (jpg, jpeg, png)",
        }));
        setIsImageUploaded(false);
        setPreviewImage((prev) => ({ ...prev, selectedImage: null }));
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imagePreviewUrl = e.target?.result as string;
        setPreviewImage((prev) => ({
          ...prev,
          selectedImage: imagePreviewUrl,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedImage(null);
      setPreviewImage((prev) => ({ ...prev, selectedImage: null }));
      setProfileImageError((prev) => ({ ...prev, logo: "" }));
      setIsImageUploaded(false);
    }
  };

  const submitAccountsSocialInfo = async (
    e: React.ChangeEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const profilePicErrorExist = {
      profile_pic: "",
    };
    if (selectedImage) {
      if (isImageUploaded) {
        const allowedExtensions = ["jpg", "jpeg", "png"];
        const fileExtension = (selectedImage as File).name
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
        if (typeof selectedImage === "string") {
          if (
            selectedImage?.includes(".jpg") ||
            selectedImage?.includes(".jpeg") ||
            selectedImage?.includes(".png")
          ) {
            profilePicErrorExist.profile_pic = "";
          }
        }
      }
    }
    setProfileImageError((prev) => ({
      ...prev,
      logo: profilePicErrorExist.profile_pic,
    }));
    if (profilePicErrorExist.profile_pic) {
      return;
    } else {
      const payload = {
        logo: selectedImage,
        facebook_url: formData.facebookUrl || "",
        twitter_url: formData.twitterUrl || "",
        googleplus_url: formData.googleUrl || "",
        instagram_url: formData.instagramUrl || "",
        youtube_url: formData.youtubeUrl || "",
        snapchat_url: formData.snapchatUrl || "",
        tiktok_url: formData.tiktokUrl || "",
        footer_copyright: formData.footerCopyright || "",
        id: isAccountsAdded ? parseInt(isAccountsAdded as any) : "",
        company_id: account.company_id,
      };
      try {
        if (isAccountsAdded) {
          setIsLoading(true);
          const res = await dispatch(editAccount(payload));
          if (res.payload?.status === SUCCESS_CODE) {
            toast.success(
              res.payload.data?.message || "Account updated successfully"
            );
            secureLocalStorage.removeItem("newlyAddedAccounts");
            secureLocalStorage.removeItem("accountPage");
            navigate("/accounts");
          } else {
            return toast.error(
              res.payload.response?.data?.message || "Something went wrong"
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

  return (
    <>
      {isDataLoaded ? (
        <CustomLoader color="fill-pink-600" />
      ) : (
        <form
          className="grid grid-cols-12 gap-4 mt-3"
          onSubmit={submitAccountsSocialInfo}
        >
          <div className="col-span-12 intro-y sm:col-span-6 md:col-span-4 flex flex-col justify-center">
            <FormLabel className="flex gap-5" htmlFor="input-wizard-1">
              Logo
              {Object.keys(previewImage).length > 0 &&
              previewImage.selectedImage !== null &&
              typeof selectedImage === "object" ? (
                <div className="w-9 h-9 image-fit -mt-5 shadow-lg">
                  <img
                    alt="Preview"
                    className="rounded-full cursor-pointer"
                    src={previewImage.selectedImage}
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
                          import.meta.env.VITE_REACT_APP_ACCOUNT_IMAGE_URL
                        }/${selectedImage}`}
                        onClick={() =>
                          openImageInNewTab(
                            `${
                              import.meta.env.VITE_REACT_APP_ACCOUNT_IMAGE_URL
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
              id="input-wizard-1"
              className={`py-[0.3rem] border border-slate-200 px-3 ${
                profileImageError.logo && "border-danger dark:!border-red-500"
              }`}
              type="file"
              onChange={handleImageChange}
            />
            {profileImageError.logo && (
              <div className="mt-2 text-xs sm:text-sm text-danger dark:text-red-500">
                {typeof profileImageError.logo === "string" &&
                  profileImageError.logo}
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
            <FormLabel htmlFor="input-wizard-3">Twitter URL</FormLabel>
            <FormInput
              id="input-wizard-3"
              type="url"
              placeholder="Enter Twitter URL"
              name="twitterUrl"
              onInput={(e: ChangeEvent<HTMLInputElement>) =>
                handleInputChange(e, "twitterUrl")
              }
              value={formData.twitterUrl}
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
          <div className="col-span-12 intro-y md:col-span-4">
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
          <div className="flex justify-center items-center col-span-12 mt-3 intro-y sm:justify-end">
            <Button
              variant="secondary"
              className="w-24 text-xs"
              onClick={() => setPage?.("1")}
              type="button"
            >
              Previous
            </Button>
            <Button
              variant="primary"
              className="ml-2 text-xs"
              type="submit"
              disabled={isLoading || profileImageError.logo ? true : false}
            >
              {isLoading ? (
                <>
                  Update Accounts
                  <LoadingIcon
                    icon="oval"
                    color="white"
                    className="w-4 h-4 ml-2"
                  />
                </>
              ) : (
                "Update Accounts"
              )}
            </Button>
          </div>
        </form>
      )}
    </>
  );
};

export default AccountsSocialInfo;
