import React from "react";
import { Dialog } from "../../base-components/Headless";
import Button from "../../base-components/Button";
import LoadingIcon from "../../base-components/LoadingIcon";

interface EmailVerificationModalProps {
  emailVerificationModal: boolean;
  isLoading: boolean;
  emailVerificationBtnRef: React.MutableRefObject<null>;
  setEmailVerificationModal: React.Dispatch<React.SetStateAction<boolean>>;
  resendVerificationEmail: () => Promise<void>;
}

const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
  emailVerificationModal,
  isLoading,
  emailVerificationBtnRef,
  setEmailVerificationModal,
  resendVerificationEmail,
}) => {
  return (
    <Dialog
      open={emailVerificationModal}
      onClose={() => {
        setEmailVerificationModal(false);
      }}
      initialFocus={emailVerificationBtnRef}
      size="lg"
    >
      <Dialog.Panel>
        <div className="p-5 text-center">
          <div className="mt-5 text-lg sm:text-xl">
            Are you sure you want to resend verification email?
          </div>
        </div>
        <div className="px-5 pb-8 text-center flex justify-end gap-5">
          <Button
            variant="outline-secondary"
            type="button"
            onClick={() => {
              setEmailVerificationModal(false);
            }}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            variant="instagram"
            type="button"
            ref={emailVerificationBtnRef}
            onClick={resendVerificationEmail}
            disabled={isLoading}
            className="text-xs"
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
              "Resend Email"
            )}
          </Button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
};

export default EmailVerificationModal;
