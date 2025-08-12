import React from "react";

interface NoDataProps {
  customCss?: string;
}

const NoDataToDisplay: React.FC<NoDataProps> = ({ customCss }) => {
  return (
    <header
      className={`pt-10 text-base text-slate-500 dark:text-slate-300 lg:text-xl font-medium ${customCss}`}
    >
      No data to display...
    </header>
  );
};

export default NoDataToDisplay;
