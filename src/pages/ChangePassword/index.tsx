import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react"; // Importing eye icons from Lucide
import Button from "../../base-components/Button";
import { FormInput, FormLabel } from "../../base-components/Form";
import { changePassword } from "../../stores/auth";
import { useAppDispatch } from "../../stores/hooks";
import LoadingIcon from "../../base-components/LoadingIcon";
import { useState } from "react";
import { SUCCESS_CODE } from "../../utils/constants";

// Define the form input type
interface ChangePasswordFormInputs {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Define the Yup validation schema
const schema = yup.object().shape({
  oldPassword: yup.string().required("Old Password is required"),
  newPassword: yup
    .string()
    .min(6, "New Password must be at least 6 characters")
    .max(12, "New Password must not exceed 12 characters")
    .required("New Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormInputs>({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false); // Manage loading state
  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  // Function to toggle visibility of passwords
  const togglePasswordVisibility = (field: keyof typeof showPassword) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  // Form submission handler
  const onSubmit: SubmitHandler<ChangePasswordFormInputs> = async (data) => {
    setIsLoading(true); // Set loading state to true before processing
    try {
      const response: any = await dispatch(changePassword(data as any));
      // Handle response
      if (response.payload?.status === SUCCESS_CODE) {
        toast.success(response.payload?.data?.message || "Password changed successfully!");
        navigate("/"); // Navigate to home after success
      } else {
        toast.error(
          response.payload?.response?.data?.message ||
            "Failed to change password. Please try again."
        );
      }
    } catch (error) {
      console.log("Error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false); // Always set loading to false after processing
    }
  };

  return (
    <div>
      <h2 className="mr-auto text-lg font-medium intro-y mt-5">
        Change Password
      </h2>
      <div className="py-5 mt-5 intro-y box px-5 sm:px-20">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-12 gap-4 mt-5 gap-y-5"
        >
          {/* Old Password */}
          <div className="col-span-12">
            <FormLabel htmlFor="oldPassword">
              Old Password <span className="text-red-600 font-bold">*</span>
            </FormLabel>
            <div className="relative">
              <FormInput
                type={showPassword.oldPassword ? "text" : "password"}
                id="oldPassword"
                placeholder="Old Password"
                {...register("oldPassword")}
                className={clsx(errors.oldPassword && "border-red-500")}
              />
              <div
                className="absolute right-3 top-3 cursor-pointer"
                onClick={() => togglePasswordVisibility("oldPassword")}
              >
                {showPassword.oldPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-500" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-500" />
                )}
              </div>
            </div>
            {errors.oldPassword && (
              <p className="mt-2 text-sm text-red-600">
                {errors.oldPassword.message}
              </p>
            )}
          </div>

          {/* New Password */}
          <div className="col-span-12 sm:col-span-6">
            <FormLabel htmlFor="newPassword">
              New Password <span className="text-red-600 font-bold">*</span>
            </FormLabel>
            <div className="relative">
              <FormInput
                type={showPassword.newPassword ? "text" : "password"}
                id="newPassword"
                placeholder="New Password"
                {...register("newPassword")}
                className={clsx(errors.newPassword && "border-red-500")}
              />
              <div
                className="absolute right-3 top-3 cursor-pointer"
                onClick={() => togglePasswordVisibility("newPassword")}
              >
                {showPassword.newPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-500" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-500" />
                )}
              </div>
            </div>
            {errors.newPassword && (
              <p className="mt-2 text-sm text-red-600">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="col-span-12 sm:col-span-6">
            <FormLabel htmlFor="confirmPassword">
              Confirm Password <span className="text-red-600 font-bold">*</span>
            </FormLabel>
            <div className="relative">
              <FormInput
                type={showPassword.confirmPassword ? "text" : "password"}
                id="confirmPassword"
                placeholder="Confirm Password"
                {...register("confirmPassword")}
                className={clsx(errors.confirmPassword && "border-red-500")}
              />
              <div
                className="absolute right-3 top-3 cursor-pointer"
                onClick={() => togglePasswordVisibility("confirmPassword")}
              >
                {showPassword.confirmPassword ? (
                  <EyeOff className="w-5 h-5 text-gray-500" />
                ) : (
                  <Eye className="w-5 h-5 text-gray-500" />
                )}
              </div>
            </div>
            {errors.confirmPassword && (
              <p className="mt-2 text-sm text-red-600">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="col-span-12 mt-5 flex gap-5">
            <Button
              type="submit"
              className=" text-white bg-blue-900 rounded-lg "
              disabled={isSubmitting || isLoading}
            >
              {isLoading ? (
                <LoadingIcon icon="oval" className="w-4 h-4 ml-2" />
              ) : (
                "Change Password"
              )}
            </Button>
            <Button variant="secondary" onClick={() => navigate("/")}>
              Exit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;
