import React from "react";
import { NavLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import { removeItemFromLocalStorage } from "../../stores/sideMenuSlice";
import { selectDarkMode } from "../../stores/darkModeSlice";

interface BreadcrumbProp {
  name: string;
  navigate: string;
}

interface PageHeaderProps {
  HeaderText: string;
  Breadcrumb?: BreadcrumbProp[];
  to: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  HeaderText,
  Breadcrumb,
  to,
}) => {
  const dispatch = useAppDispatch();
  const darkMode = useAppSelector(selectDarkMode);

  return (
    <div className="mt-3">
      <div className="row">
        <div className="flex gap-5 items-center">
          <div onClick={() => dispatch(removeItemFromLocalStorage())}>
            <NavLink
              to={to}
              end
              className="py-2 px-5 rounded-md cursor-pointer"
              style={({ isActive }) => ({
                color: isActive ? (darkMode ? "black" : "white") : "inherit",
                backgroundColor: isActive
                  ? darkMode
                    ? "white"
                    : "black"
                  : "inherit",
              })}
            >
              {HeaderText}
            </NavLink>
          </div>
          <ul className="breadcrumb">
            {Breadcrumb?.map((item: any, index: number) => {
              return (
                <li key={item.name + index} className="breadcrumb-item active">
                  <NavLink
                    to={item.navigate ? item.navigate : null}
                    style={({ isActive }) => ({
                      color: isActive
                        ? darkMode
                          ? "black"
                          : "white"
                        : "inherit",
                      backgroundColor: isActive
                        ? darkMode
                          ? "white"
                          : "black"
                        : "inherit",
                    })}
                    className="py-2 px-5 rounded-md"
                    end
                  >
                    {item.name}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
