import { useEffect, useState } from "react";
import { capitalizeFirstLetter } from "../../utils/helper";
import { useLocation } from "react-router-dom";

const index = () => {
  const location = useLocation();
  const [breadcrumbs, setBreadcrumbs] = useState<
    { label: string; path: string }[]
  >([]);

  useEffect(() => {
    const parts = location.pathname.split("/").filter((part) => part !== "");
    const dynamicParts = parts.length > 1 ? [parts[0]] : parts;
    const breadcrumbArray =
      location.pathname === "/dashboard"
        ? []
        : [{ label: "Dashboard", path: "/dashboard" }];

    for (let i = 0; i < dynamicParts.length; i++) {
      const label = cleanLabel(parts[i]);
      const path = `/${parts.slice(0, i + 1).join("/")}`;
      breadcrumbArray.push({ label, path });
    }

    setBreadcrumbs(breadcrumbArray);
  }, [location.pathname]);

  const cleanLabel = (label: string) => {
    return label
      .split("-")
      .map((word: string) => capitalizeFirstLetter(word))
      .join(" ");
  };

  return breadcrumbs;
};

export default index;
