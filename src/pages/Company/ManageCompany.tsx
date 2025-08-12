import CompanyInfo from "../../components/Company/CompanyInfo";
import CompanySocialInfo from "../../components/Company/CompanySocialInfo";
import { useState, useEffect } from "react";
import CompanyStepForm from "../../components/MultiStepForm/CompanyStepForm";
import { useNavigate } from "react-router-dom";
import { checkPermission } from "../../utils/checkPermissions";
import CompanyBillingInfo from "../../components/Company/CompanyBillingInfo";
import { SUPER_ADMIN } from "../../utils/constants";
import BackButton from "../../components/BackButton";
import secureLocalStorage from "react-secure-storage";

function Main() {
  const companyId = secureLocalStorage.getItem("newlyAddedCompany");
  const role = secureLocalStorage.getItem("role");
  const navigate = useNavigate();
  const [hasAddPermission, setHasAddPermission] = useState<boolean>(false);
  const [hasEditPermission, setHasEditPermission] = useState<boolean>(false);

  const [page, setPage] = useState<string>("1");

  useEffect(() => {
    const fetchPermission = async () => {
      const doesHaveAddPermission = await checkPermission(
        "company_management",
        "add"
      );
      const doesHaveEditPermission = await checkPermission(
        "company_management",
        "edit"
      );
      setHasAddPermission(doesHaveAddPermission);
      setHasEditPermission(doesHaveEditPermission);
      if (
        !doesHaveAddPermission &&
        !doesHaveEditPermission &&
        role !== SUPER_ADMIN
      ) {
        navigate("/unauthorized");
        secureLocalStorage.removeItem("companyPage");
      }
    };
    fetchPermission();
  }, []);

  useEffect(() => {
    const storedPage = secureLocalStorage.getItem("companyPage");
    if (storedPage) {
      setPage(storedPage as any);
    }
  }, []);

  useEffect(() => {
    secureLocalStorage.setItem("companyPage", page);
  }, [page]);

  const nextPage = (page: string) => {
    setPage(page);
  };

  const nextPageNumber = (pageNumber: string) => {
    switch (pageNumber) {
      case "1":
        setPage("1");
        break;
      case "2":
        setPage("2");
        break;
      case "3":
        setPage("3");
        break;
      default:
        setPage("1");
    }
  };

  return (
    <>
      {(hasAddPermission || hasEditPermission || role === SUPER_ADMIN) && (
        <div>
          <BackButton
            title={companyId ? "Update Company" : "Add Company"}
            to="/company"
            variant="linkedin"
          />
          <div className="py-5 mt-2 intro-y box">
            <CompanyStepForm
              setPage={setPage}
              page={page}
              onPageNumberClick={nextPageNumber}
            />
            <div className="px-5 pt-3 mt-3 border-t sm:px-10 border-slate-300/60 dark:border-darkmode-400">
              {
                {
                  1: <CompanyInfo nextPage={nextPage} setPage={setPage} />,
                  2: (
                    <CompanySocialInfo nextPage={nextPage} setPage={setPage} />
                  ),
                  3: (
                    <CompanyBillingInfo nextPage={nextPage} setPage={setPage} />
                  ),
                }[page]
              }
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Main;
