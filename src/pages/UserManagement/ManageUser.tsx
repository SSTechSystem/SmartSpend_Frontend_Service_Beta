import React, { useEffect, useState } from "react";
import AddUserForm from "../../components/UserManagement/AddUserForm";
import { checkPermission } from "../../utils/checkPermissions";
import { useNavigate } from "react-router-dom";
import { SUPER_ADMIN } from "../../utils/constants";
import BackButton from "../../components/BackButton";
import secureLocalStorage from "react-secure-storage";

const ManageUser: React.FC = () => {
  const userId = secureLocalStorage.getItem("newlyAddedUser");
  const role = secureLocalStorage.getItem("role");
  const [hasAddPermission, setHasAddPermission] = useState<boolean>(false);
  const [hasEditPermission, setHasEditPermission] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPermission = async () => {
      const doesHaveAddPermission = await checkPermission(
        "user_management",
        "add"
      );
      const doesHaveEditPermission = await checkPermission(
        "user_management",
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
      }
    };
    fetchPermission();
  }, []);

  return (
    <>
      {(hasAddPermission || hasEditPermission || role === SUPER_ADMIN) && (
        <div>
          <BackButton
            to="/user"
            variant="linkedin"
            title={userId ? "Update User" : "Add User"}
          />

          <div className="py-2 mt-2 intro-y box">
            <div className="px-5 sm:px-10">
              <AddUserForm />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageUser;
