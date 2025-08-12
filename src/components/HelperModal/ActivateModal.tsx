import React from "react";
import { Dialog } from "../../base-components/Headless";
import Button from "../../base-components/Button";
import LoadingIcon from "../../base-components/LoadingIcon";
import { capitalizeByCharacter } from "../../utils/helper";

interface ActivateModalProps {
  open: boolean;
  isLoading: boolean;
  checked: boolean;
  moduleName: string;
  focusRef: React.MutableRefObject<null>;
  onClose(value: boolean): void;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
}

const ActivateModal: React.FC<ActivateModalProps> = ({
  open,
  isLoading,
  checked,
  moduleName,
  focusRef,
  onClose,
  onClick,
}) => {
  return (
    <Dialog open={open} onClose={onClose} size="lg" initialFocus={focusRef}>
      <Dialog.Panel>
        <div className="p-5 text-center">
          <div className="mt-5 text-lg sm:text-xl">
            Are you sure you want to {checked ? "activate" : "deactivate"} this{" "}
            {moduleName}?
          </div>
        </div>
        <div className="px-5 pb-8 text-center flex flex-wrap justify-end gap-5">
          <Button
            variant="outline-secondary"
            type="button"
            onClick={onClose as any}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            type="button"
            onClick={onClick}
            disabled={isLoading}
            className="text-xs"
            ref={focusRef}
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
              <span className="tracking-wider">
                {checked ? "Activate" : "Deactivate"}{" "}
                {capitalizeByCharacter(moduleName, " ")}
              </span>
            )}
          </Button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
};

export default ActivateModal;
