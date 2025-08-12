import { Slide, Snackbar } from "@mui/material";
import React from "react";
import { useAppDispatch } from "../../stores/hooks";
import { hideToast } from "../../stores/toastSlice";
import MuiAlert from "@mui/material/Alert";

const SlideTransition = (props: any) => {
  return <Slide {...props} direction="down" />;
};

interface ToastComponentProps {
  message: string;
  type: "success" | "error";
}

const MaterialToast: React.FC<ToastComponentProps> = ({ message, type }) => {
  const dispatch = useAppDispatch();

  const handleClose = () => {
    dispatch(hideToast());
  };

  return (
    <Snackbar
      open={true}
      onClose={handleClose}
      autoHideDuration={3000}
      TransitionComponent={SlideTransition}
      anchorOrigin={{ horizontal: "right", vertical: "top" }}
    >
      <MuiAlert
        elevation={6}
        variant="filled"
        onClose={handleClose}
        severity={type}
      >
        {message}
      </MuiAlert>
    </Snackbar>
  );
};

export default MaterialToast;
