import React, { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import { hideToast, toastMessage, toastType } from "../../stores/toastSlice";
import Toastify from "toastify-js";
import Lucide from "../../base-components/Lucide";
import { ERROR_TEXT } from "../../utils/constants";

const Toast: React.FC = () => {
  const dispatch = useAppDispatch();
  const toastRef = useRef<any | null>(null);
  const toastNodeRef = useRef<HTMLDivElement | null>(null);
  const message = useAppSelector(toastMessage);
  const type = useAppSelector(toastType);

  useEffect(() => {
    if (message && toastNodeRef.current) {
      if (toastRef.current) {
        toastRef.current.showToast();
      } else {
        toastRef.current = Toastify({
          duration: 3000,
          node: toastNodeRef.current,
          gravity: "top",
          position: "right",
          stopOnFocus: true,
          newWindow: true,
          close: true,
          className: "toast-class",
          callback: () => {
            dispatch(hideToast());
          },
        });
        toastRef.current.showToast();
      }
    }
  }, [message, dispatch]);

  return (
    <div
      ref={toastNodeRef}
      className={`py-5 pl-5 pr-14 bg-white border border-slate-200/60 rounded-lg shadow-xl dark:bg-darkmode-600 dark:text-slate-300 dark:border-darkmode-600 ${
        message ? "flex" : "hidden"
      }`}
    >
      <Lucide
        icon={type === ERROR_TEXT ? "XCircle" : "CheckCircle"}
        className={`text-${type === ERROR_TEXT ? "danger" : "success"}`}
      />
      <div className="ml-4 mr-4">
        <div className="mt-1 text-slate-500 dark:text-slate-400">{message}</div>
      </div>
    </div>
  );
};

export default Toast;
