import React, { useEffect, useState } from "react";
import AccountsInfo from "../../components/Accounts/AccountsInfo";
import AccountsSocialInfo from "../../components/Accounts/AccountsSocialInfo";
import AccountsStepForm from "../../components/MultiStepForm/AccountsStepForm";
import { checkPermission } from "../../utils/checkPermissions";
import { useNavigate } from "react-router-dom";
import { SUPER_ADMIN } from "../../utils/constants";
import BackButton from "../../components/BackButton";
import secureLocalStorage from "react-secure-storage";

const ManageAccounts: React.FC = () => {
  const accountsId = secureLocalStorage.getItem("newlyAddedAccounts");
  const role = secureLocalStorage.getItem("role");
  const [hasAddPermission, setHasAddPermission] = useState<boolean>(false);
  const [hasEditPermission, setHasEditPermission] = useState<boolean>(false);
  const navigate = useNavigate();

  const [page, setPage] = useState<string>("1");

  useEffect(() => {
    const fetchPermission = async () => {
      const doesHaveAddPermission = await checkPermission(
        "account_management",
        "add"
      );
      const doesHaveEditPermission = await checkPermission(
        "account_management",
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
        secureLocalStorage.removeItem("accountPage");
      }
    };
    fetchPermission();
  }, []);

  useEffect(() => {
    const storedPage = secureLocalStorage.getItem("accountPage");
    if (storedPage) {
      setPage(storedPage as any);
    }
  }, []);

  useEffect(() => {
    secureLocalStorage.setItem("accountPage", page);
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
      default:
        setPage("1");
    }
  };

  return (
    <>
      {(hasAddPermission || hasEditPermission || role === SUPER_ADMIN) && (
        <div>
          <BackButton
            to="/accounts"
            variant="instagram"
            title={accountsId ? "Update Accounts" : "Add Accounts"}
          />
          <div className="py-5 mt-2 intro-y box">
            <AccountsStepForm
              setPage={setPage}
              page={page}
              onPageNumberClick={nextPageNumber}
            />
            <div className="px-5 pt-3 mt-3 border-t sm:px-10 border-slate-300/60 dark:border-darkmode-400">
              {
                {
                  1: <AccountsInfo nextPage={nextPage} setPage={setPage} />,
                  2: (
                    <AccountsSocialInfo nextPage={nextPage} setPage={setPage} />
                  ),
                }[page]
              }
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageAccounts;
