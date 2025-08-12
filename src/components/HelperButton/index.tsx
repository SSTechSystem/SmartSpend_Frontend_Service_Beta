import React from "react";
import Tippy from "../../base-components/Tippy";
import Button from "../../base-components/Button";
import LoadingIcon from "../../base-components/LoadingIcon";
import Lucide from "../../base-components/Lucide";

interface ResetButtonProps {
  disabled?: boolean | undefined;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  type: "reset" | "search" | "download";
}

const ResetOrSearchButton: React.FC<ResetButtonProps> = ({
  disabled,
  type,
  onClick,
}) => {
  return (
    <Tippy
      content={
        type === "reset"
          ? "Click to reset filters"
          : type === "search"
          ? "Click to apply filters"
          : "Export data to Excel"
      }
    >
      <Button
        variant={type === "reset" ? "instagram" : "linkedin"}
        onClick={onClick}
        disabled={disabled}
        className={`px-2 py-[6px] sm:py-2 sm:px-3 ${
          type === "download" && "bg-green-700"
        }`}
      >
        {disabled ? (
          <>
            <LoadingIcon icon="oval" color="white" className="w-5 h-5" />
          </>
        ) : (
          <Lucide
            icon={
              type === "reset"
                ? "RotateCcw"
                : type === "search"
                ? "Search"
                : "Download"
            }
            color="white"
            className="w-4 h-4 sm:w-5 sm:h-5"
          />
        )}
      </Button>
    </Tippy>
  );
};

export default ResetOrSearchButton;
