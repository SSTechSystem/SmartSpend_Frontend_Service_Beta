import React, { useState, useRef, useEffect } from "react";
import { Dialog } from "../../base-components/Headless";
import { FormCheck, FormLabel } from "../../base-components/Form";
import Table from "../../base-components/Table";
import Button from "../../base-components/Button";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import {
  fetchAllPermissions,
  fetchSingleModulePermission,
  getPermissionsData,
  getRoleNameData,
  getSomePermissionsData,
  updatePermission,
} from "../../stores/managePermission";
import LoadingIcon from "../../base-components/LoadingIcon";
import { toast } from "react-toastify";
import Loader from "../Loader";
import { SUCCESS_CODE } from "../../utils/constants";
interface PermissionProps {
  permissionModal: boolean;
  setPermissionModal: (permission: boolean) => void;
  selectedRoleId: number;
}

const PermissionsModal: React.FC<PermissionProps> = ({
  permissionModal,
  setPermissionModal,
  selectedRoleId,
}) => {
  const [selectAllCheckboxes, setSelectAllCheckboxes] =
    useState<boolean>(false);
  const [permissionCheckboxes, setPermissionCheckboxes] = useState<{
    [moduleId: string]: {
      [permissionType: string]: boolean;
    };
  }>({});
  const [transformedObj, setTransformedObj] = useState<{
    [type: string]: boolean;
  }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);
  const permissionButtonRef = useRef(null);
  const dispatch = useAppDispatch();
  const permissionsArr: any = useAppSelector(getPermissionsData);
  const somePermissionArr: any = useAppSelector(getSomePermissionsData);
  const roleName = useAppSelector(getRoleNameData);

  useEffect(() => {
    const fetchPermissionData = async () => {
      if (permissionModal) {
        setIsDataLoaded(true);
        await dispatch(fetchAllPermissions());
        await dispatch(fetchSingleModulePermission(Number(selectedRoleId)));
        setIsDataLoaded(false);
      }
    };
    fetchPermissionData();
  }, [permissionModal]);

  useEffect(() => {
    if (somePermissionArr !== null) {
      // Prefill checkboxes based on perArr
      const prefillCheckboxes: {
        [moduleId: string]: {
          [permissionType: string]: boolean;
        };
      } = {};

      Object.keys(somePermissionArr).forEach((moduleKey) => {
        prefillCheckboxes[moduleKey] = {};

        Object.keys(somePermissionArr[moduleKey]).forEach((permissionType) => {
          prefillCheckboxes[moduleKey][permissionType] = true;
        });
      });

      setPermissionCheckboxes(prefillCheckboxes);

      // Check if all checkboxes are pre-filled
      const allCheckboxesPrefilled =
        permissionsArr !== null &&
        Object.keys(permissionsArr).every((moduleKey) =>
          Object.keys(permissionsArr[moduleKey]).every(
            (permissionType) => prefillCheckboxes[moduleKey]?.[permissionType]
          )
        );

      // Set the state of the "Select All" checkbox based on allCheckboxesPrefilled
      setSelectAllCheckboxes(allCheckboxesPrefilled);

      const transformedPermissionsObject = Object.keys(
        somePermissionArr
      ).reduce((result: any, module) => {
        const modulePermissions = somePermissionArr[module];
        Object.keys(modulePermissions).forEach((permType) => {
          if (modulePermissions[permType]) {
            result[somePermissionArr[module][permType]] = true;
          }
        });
        return result;
      }, {});

      setTransformedObj(transformedPermissionsObject);
    }
  }, [somePermissionArr]);

  const handleSelectAllCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { checked } = event.target;

    const newPermissionCheckboxes: {
      [moduleId: string]: {
        [permissionType: string]: boolean;
      };
    } = {};

    for (const moduleKey of Object.keys(permissionsArr)) {
      newPermissionCheckboxes[moduleKey] = {};

      for (const permissionKey of Object.keys(permissionsArr[moduleKey])) {
        newPermissionCheckboxes[moduleKey][permissionKey] = checked;
      }
    }

    setSelectAllCheckboxes(checked);
    setPermissionCheckboxes(newPermissionCheckboxes);
    const transformedPermissionsObject = Object.keys(
      newPermissionCheckboxes
    ).reduce((result: any, module) => {
      const modulePermissions = newPermissionCheckboxes[module];
      Object.keys(modulePermissions).forEach((permType) => {
        if (modulePermissions[permType]) {
          result[permissionsArr[module][permType]] = true;
        }
      });
      return result;
    }, {});

    setTransformedObj(transformedPermissionsObject);
  };

  const handlePermissionCheckboxChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    moduleId: string,
    permissionType: string
  ) => {
    const { checked } = event.target;

    const newPermissionCheckboxes = {
      ...permissionCheckboxes,
      [moduleId]: {
        ...permissionCheckboxes[moduleId],
        [permissionType]: checked,
      },
    };

    setPermissionCheckboxes(newPermissionCheckboxes);

    // Check if all checkboxes for the specific module are checked
    const allPermissionsChecked = Object.keys(newPermissionCheckboxes).every(
      (module) =>
        Object.keys(permissionsArr[module]).every(
          (permissionType) =>
            newPermissionCheckboxes[module][permissionType] === true
        )
    );

    // If all permissions in the module are checked, set the "Select All" checkbox to checked
    // Otherwise, set it to unchecked
    setSelectAllCheckboxes(allPermissionsChecked);

    const transformedPermissionsObject = Object.keys(
      newPermissionCheckboxes
    ).reduce((result: any, module) => {
      const modulePermissions = newPermissionCheckboxes[module];
      Object.keys(modulePermissions).forEach((permType) => {
        if (modulePermissions[permType]) {
          result[permissionsArr[module][permType]] = true;
        }
      });
      return result;
    }, {});

    setTransformedObj(transformedPermissionsObject);
  };
  const updatePermissions = async () => {
    const payload: any = [];
    for (const outerKey in transformedObj) {
      payload.push(outerKey);
    }
    try {
      setIsLoading(true);
      const data = {
        role_id: selectedRoleId,
        permissions: payload,
      };
      const res = await dispatch(updatePermission(data));
      if (res.payload?.status === SUCCESS_CODE) {
        toast.success(res.payload.data?.message || "Permission updated");
        setPermissionModal(false);
      } else {
        return toast.error(
          res.payload?.response?.data?.message || "Something went wrong"
        );
      }
    } catch (error) {
      console.error("Error", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog
        open={permissionModal}
        onClose={() => {
          setPermissionModal(false);
        }}
        size="lg"
        initialFocus={permissionButtonRef}
      >
        <Dialog.Panel className="max-h-[400px] overflow-auto md:overflow-hidden md:max-h-[530px]">
          <>
            {permissionsArr === null || isDataLoaded ? (
              <Loader icon="puff" />
            ) : (
              <>
                <p className="px-5 pt-3 pb-1 border-b">
                  Role Name :{" "}
                  <span className="uppercase font-semibold text-sm sm:text-base">
                    {roleName}
                  </span>
                </p>
                <div className="px-5 text-center">
                  <div className="text-lg sm:text-xl mt-3 font-medium">
                    Permissions
                  </div>
                </div>

                <div className="px-5">
                  <FormLabel htmlFor="input-wizard-1">Select All</FormLabel>
                  <FormCheck.Input
                    className="border-slate-400 ml-3"
                    type="checkbox"
                    id="input-wizard-1"
                    checked={selectAllCheckboxes}
                    onChange={handleSelectAllCheckboxChange}
                  />
                </div>
                <div className="col-span-12 overflow-auto max-h-[350px] intro-y px-5">
                  <Table className="">
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th className="border-b-0 whitespace-nowrap">
                          Module
                        </Table.Th>
                        <Table.Th className="text-center border-b-0 whitespace-nowrap">
                          Permissions
                        </Table.Th>
                      </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                      {permissionsArr !== null &&
                        Object.keys(permissionsArr).map((permission, index) => (
                          <Table.Tr key={index} className="intro-x">
                            <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b] capitalize text-xs sm:text-[13px]">
                              {permission && permission.replace("_", " ")}
                            </Table.Td>
                            <Table.Td
                              className="first:rounded-l-md text-center last:rounded-r-md bg-white border border-r-0 border-l-0 first:border-l last:border-r border-slate-200 dark:bg-darkmode-600 dark:border-darkmode-600 shadow-[20px_3px_20px_#0000000b]"
                              key={index}
                            >
                              <div className="flex gap-3 justify-between items-center text-xs sm:text-[13px]">
                                {Object.keys(permissionsArr[permission]).map(
                                  (permissionType, idx) => (
                                    <label
                                      key={permissionType}
                                      className="inline-flex items-center mb-1"
                                      htmlFor={`checkbox-${permissionType}-${index}-${idx}`}
                                    >
                                      <span className="mr-2 capitalize cursor-pointer">
                                        {permissionType}
                                      </span>
                                      <FormCheck.Input
                                        key={permissionType}
                                        className="border-slate-400"
                                        type="checkbox"
                                        id={`checkbox-${permissionType}-${index}-${idx}`}
                                        checked={
                                          permissionCheckboxes[permission]?.[
                                            permissionType
                                          ] || false
                                        }
                                        onChange={(e) =>
                                          handlePermissionCheckboxChange(
                                            e,
                                            permission,
                                            permissionType
                                          )
                                        }
                                      />
                                    </label>
                                  )
                                )}
                              </div>
                            </Table.Td>
                          </Table.Tr>
                        ))}
                    </Table.Tbody>
                  </Table>
                </div>
                <div className="px-5 pb-5 mt-5 text-end">
                  <Button
                    variant="outline-secondary"
                    type="button"
                    onClick={() => {
                      setPermissionModal(false);
                    }}
                    className="w-24 text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="linkedin"
                    type="button"
                    className="ml-4 text-xs"
                    ref={permissionButtonRef}
                    disabled={isLoading}
                    onClick={updatePermissions}
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
                      "Update Permission"
                    )}
                  </Button>
                </div>
              </>
            )}
          </>
        </Dialog.Panel>
      </Dialog>
    </>
  );
};

export default PermissionsModal;
