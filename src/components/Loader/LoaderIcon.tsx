import React from "react";
import LoadingIcon from "../../base-components/LoadingIcon";

interface LoaderIconProps {
  icon:
    | "audio"
    | "ball-triangle"
    | "bars"
    | "circles"
    | "grid"
    | "hearts"
    | "oval"
    | "puff"
    | "rings"
    | "spinning-circles"
    | "tail-spin"
    | "three-dots";
  customClass?: string;
  msg?: string;
}

const LoaderIcon: React.FC<LoaderIconProps> = ({ icon, customClass, msg }) => {
  return (
    <div
      className={`absolute inset-x-0 inset-y-0 flex justify-center bg-[#9191963a] text-white z-10 dark:z-[9999] dark:bg-[#cfc7c725] ${customClass} pt-3 sm:pt-0 ${
        msg && "flex-col gap-2 justify-start items-center bg-[#0000003a]"
      }`}
    >
      <LoadingIcon icon={icon} className="w-7 h-7 sm:w-10 sm:h-10" />
      {msg && (
        <section className="text-slate-950 dark:text-white text-xl">
          {msg}
        </section>
      )}
    </div>
  );
};

export default LoaderIcon;
