import React from "react";
import Button from "../../base-components/Button";
import secureLocalStorage from "react-secure-storage";

interface companyStepProps {
  page: string;
  onPageNumberClick?: (pageNumber: string) => void;
  setPage: (newPage: string) => void;
}

const stepNames = ["Company Info", "Media / Social", "Billing Settings"];

const CompanyStepForm: React.FC<companyStepProps> = ({
  page,
  onPageNumberClick,
  setPage,
}) => {
  const isCompanyAdded = secureLocalStorage.getItem("newlyAddedCompany");

  const changeForm = (idx: number) => {
    if (isCompanyAdded) setPage(String(idx + 1));
  };

  return (
    <>
      {/* BEGIN: Wizard Layout */}
      <div className="relative before:hidden before:md:block before:absolute before:w-[55%] before:h-[3px] before:top-0 before:bottom-0 before:mt-3 before:bg-slate-200 before:dark:bg-darkmode-400 flex flex-col md:flex-row justify-center px-5 sm:px-20">
        {stepNames.map((name, idx) => (
          <div
            className="z-10 text-xs sm:text-sm flex items-center flex-1 intro-x md:text-center md:block first:mt-0 mt-3 md:mt-0"
            key={idx}
          >
            <Button
              variant={page === String(idx + 1) ? "primary" : "secondary"}
              className="w-7 h-7 rounded-full"
              onClick={() => changeForm(idx)}
            >
              {idx + 1}
            </Button>
            <div
              className={`ml-3 font-medium md:w-24 md:mt-3 md:mx-auto cursor-pointer ${
                page === String(idx + 1) ? "text-inherit" : "text-slate-400"
              }`}
              onClick={() => changeForm(idx)}
            >
              {name}
            </div>
          </div>
        ))}
      </div>
      {/* END: Wizard Layout */}
    </>
  );
};

export default CompanyStepForm;
