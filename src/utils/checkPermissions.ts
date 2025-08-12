import secureLocalStorage from "react-secure-storage";

export async function hasAccess(permissionKey: string) {
  try {
    const permissionsStr = await secureLocalStorage.getItem("permissions");
    const permissions = permissionsStr
      ? JSON.parse(permissionsStr as any)
      : null;

    const permission = permissions
      ? Object.keys(permissions).map((category) => {
          return permissions[category][permissionKey];
        })
      : [];
    return permission;
  } catch (error) {
    console.error("Error retrieving permissions:", error);
    return [];
  }
}

export async function checkPermission(
  moduleName: string,
  permissionType: string
) {
  try {
    const permissionsStr = await secureLocalStorage.getItem("permissions");
    const permissions = permissionsStr
      ? JSON.parse(permissionsStr as any)
      : null;

    if (
      permissions &&
      permissions[moduleName] &&
      permissions[moduleName][permissionType]
    ) {
      return true; // Permission exists
    } else {
      return false; // Permission does not exist
    }
  } catch (error) {
    console.error(
      "Error retrieving permissions from secureLocalStorage:",
      error
    );
    return false;
  }
}
