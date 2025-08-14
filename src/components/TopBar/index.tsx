import Lucide from "../../base-components/Lucide";
import Breadcrumb from "../../base-components/Breadcrumb";
import { Menu } from "../../base-components/Headless";
import _ from "lodash";
import { setLogout } from "../../stores/auth";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import secureLocalStorage from "react-secure-storage";
import BreadCrumbCompo from "../BreadCrumb";
import { removeItemFromLocalStorage } from "../../stores/sideMenuSlice";
import { useEffect, useState } from "react";
import { getDashboardData } from "../../stores/dashboard";
import moment from "moment";
import { DATE_TIME_FORMAT, SUCCESS_CODE } from "../../utils/constants";
import { selectDarkMode, setDarkMode } from "../../stores/darkModeSlice";
import {
  ColorSchemes,
  selectColorScheme,
  setColorScheme,
} from "../../stores/colorSchemeSlice";
import clsx from "clsx";

function Main(props: {
  toggleMobileMenu: (event: React.MouseEvent) => void;
  screenWidth: number;
}) {
  const [message, setMessage] = useState("");
  const breadcrumbs = BreadCrumbCompo();
  const navigate = useNavigate();
  const userName = secureLocalStorage.getItem("username") ?? null as any;
  const dashboardState = useAppSelector(getDashboardData);
  const dispatch = useAppDispatch();
  const darkMode = useAppSelector(selectDarkMode);
  const colorScheme = useAppSelector(selectColorScheme);

  useEffect(() => {
    if (dashboardState?.dashboard?.lastLogin) {
      const lastLoginText = moment(dashboardState?.dashboard?.lastLogin).format(
        DATE_TIME_FORMAT
      );
      setMessage(`Last Login - ${lastLoginText}`);

      const timer = setTimeout(() => {
        setMessage("");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [dashboardState?.dashboard?.lastLogin]);

  useEffect(() => {
    setColorSchemeClass();
  }, [colorScheme, darkMode]);

  const setColorSchemeClass = () => {
    const el = document.querySelectorAll("html")[0];
    el.setAttribute("class", colorScheme);
    darkMode && el.classList.add("dark");
  };

  const toggleDarkMode = () => {
    dispatch(setDarkMode(!darkMode));
    localStorage.setItem("darkMode", (!darkMode).toString());
    setColorSchemeClass();
  };

  const switchColorScheme = (colorScheme: ColorSchemes) => {
    dispatch(setColorScheme(colorScheme));
    localStorage.setItem("colorScheme", colorScheme);
    setColorSchemeClass();
  };

  const logout = async () => {
    const res = await dispatch(setLogout());
    if (res.payload?.status === SUCCESS_CODE) {
      toast.success(res.payload.data.message || "logout successful");
      dispatch(removeItemFromLocalStorage());
    } else {
      return toast.error(
        res.payload.response?.data?.message || "Something went wrong"
      );
    }
  };

  return (
    <>
      {/* BEGIN: Top Bar */}
      <div
        className={`h-[23px] z-[51] flex items-center justify-between relative sm:px-5 ${
          darkMode && "dark-theme"
        }`}
      >
        {/* BEGIN: Mobile Menu */}

        <div className="mr-3 -intro-x sm:mr-6 lg:hidden">
          <div
            className="cursor-pointer w-[38px] h-[38px] rounded-full border border-white/20 flex items-center justify-center"
            onClick={props.toggleMobileMenu}
          >
            <Lucide
              icon="BarChart2"
              className="w-5 h-5 text-white transform rotate-90 dark:text-slate-500"
            />
          </div>
        </div>
        {/* END: Mobile Menu */}
        <Breadcrumb
          light
          className="hidden -intro-x sm:flex mt-5 text-xs md:text-sm"
        >
          {breadcrumbs.map((breadcrumb, index) => (
            <Breadcrumb.Link
              to={breadcrumb.path}
              key={index}
              onClick={() => dispatch(removeItemFromLocalStorage())}
            >
              {breadcrumb.label}
            </Breadcrumb.Link>
          ))}
        </Breadcrumb>

        <h2 className="text-slate-200 ml-10 mt-5 text-xs md:text-sm hidden sm:block">
          {message}
        </h2>
        <div className="flex items-center mt-5 text-slate-200 ml-auto text-sm md:text-sm relative">
          <div className="m-5 relative group">
            <button
              className="cursor-pointer w-8 h-8 rounded-full border border-white/20 flex items-center justify-center transition duration-300 ease-in-out transform hover:scale-110"
              onClick={toggleDarkMode}
            >
              {darkMode ? (
                <Lucide icon="Sun" className="w-4 h-4 text-white" />
              ) : (
                <Lucide icon="Moon" className="w-4 h-4 text-white" />
              )}
            </button>
            {!darkMode && (
              <div className="absolute top-full left-[-50px] mt-[3px] p-[5px] rounded-2xl border shadow-md bg-white dark:bg-slate-800 flex-row items-center justify-center hidden group-hover:flex">
                <span
                  onClick={() => {
                    switchColorScheme("default");
                  }}
                  className={clsx({
                    "block w-7 h-7 sm:w-8 sm:h-8 cursor-pointer bg-[#00195f] rounded-full border-4 mx-1 hover:border-slate-200":
                      true,
                    "border-slate-300 dark:border-darkmode-800/80":
                      colorScheme == "default",
                    "border-white dark:border-darkmode-600":
                      colorScheme != "default",
                  })}
                ></span>
                <span
                  onClick={() => {
                    switchColorScheme("theme-1");
                  }}
                  className={clsx({
                    "block w-7 h-7 sm:w-8 sm:h-8 cursor-pointer bg-[rgb(1,20,35)] rounded-full border-4 mx-1 hover:border-slate-200":
                      true,
                    "border-slate-300 dark:border-darkmode-800/80":
                      colorScheme == "theme-1",
                    "border-white dark:border-darkmode-600":
                      colorScheme != "theme-1",
                  })}
                ></span>
                <span
                  onClick={() => {
                    switchColorScheme("theme-2");
                  }}
                  className={clsx({
                    "block w-7 h-7 sm:w-8 sm:h-8 cursor-pointer bg-[#2d3c5a] rounded-full border-4 mx-1 hover:border-slate-200":
                      true,
                    "border-white dark:border-darkmode-600":
                      colorScheme != "theme-2",
                  })}
                ></span>
              </div>
            )}
          </div>
          {/* BEGIN: Account Menu */}
          <Menu className="h-10 intro-x ml-3">
            <Menu.Button className="flex items-center h-full dropdown-toggle">
              <div className="ml-3 block text-slate-200">
                <div className="flex items-center gap-1 text-xs md:text-sm">
                  <div className="font-medium">{userName ? userName : ""}</div>
                  <div>
                    <Lucide icon="ChevronDown" className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Menu.Button>
            <Menu.Items className="w-56 mt-px text-slate-700 dark:text-slate-200 text-xs md:text-sm">
              <Menu.Item onClick={() => navigate("/profile")}>
                <Lucide icon="User" className="w-4 h-4 mr-2" /> Profile
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item onClick={logout}>
                <Lucide icon="ToggleRight" className="w-4 h-4 mr-2" /> Logout
              </Menu.Item>
            </Menu.Items>
          </Menu>
          {/* END: Account Menu */}
        </div>
      </div>
      {/* END: Top Bar */}
    </>
  );
}

export default Main;
