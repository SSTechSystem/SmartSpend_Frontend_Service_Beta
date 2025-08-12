import React from "react";
import Button from "../../base-components/Button";
import { useAppDispatch } from "../../stores/hooks";
import { removeItemFromLocalStorage } from "../../stores/sideMenuSlice";
import { useNavigate } from "react-router-dom";

type Variant =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "pending"
  | "danger"
  | "dark"
  | "outline-primary"
  | "outline-secondary"
  | "outline-success"
  | "outline-warning"
  | "outline-pending"
  | "outline-danger"
  | "outline-dark"
  | "soft-primary"
  | "soft-secondary"
  | "soft-success"
  | "soft-warning"
  | "soft-pending"
  | "soft-danger"
  | "soft-dark"
  | "facebook"
  | "twitter"
  | "instagram"
  | "linkedin";

interface BackButtonProps {
  variant: Variant;
  title: string;
  text?: string;
  to: string;
}

const BackButton: React.FC<BackButtonProps> = ({
  variant,
  to,
  title,
  text = "Back",
}) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  return (
    <div className="flex items-center mt-2 px-1 gap-5">
      <Button
        variant={variant}
        onClick={() => {
          dispatch(removeItemFromLocalStorage());
          navigate(to);
        }}
        className="py-1 text-xs sm:text-sm"
      >
        {text}
      </Button>
      <h2 className="sm:text-lg font-medium intro-y">{title}</h2>
    </div>
  );
};

export default BackButton;
