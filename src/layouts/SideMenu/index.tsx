import { Transition } from "react-transition-group";
import {
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  createRef,
  useRef,
} from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import useCallbackState from "../../utils/callback-state";
import {
  removeItemFromLocalStorage,
  selectSideMenu,
} from "../../stores/sideMenuSlice";
import { useAppDispatch, useAppSelector } from "../../stores/hooks";
import { FormattedMenu, linkTo, nestedMenu, enter, leave } from "./side-menu";
import Lucide from "../../base-components/Lucide";
import logoUrl from "../../assets/images/SmratSpendSVG.png";
import driverLogo from "../../assets/images/logowithouttext.svg";
import clsx from "clsx";
import TopBar from "../../components/TopBar";
import SimpleBar from "simplebar";
import { selectColorScheme } from "../../stores/colorSchemeSlice";

function Main() {
  const location = useLocation();
  const [formattedMenu, setFormattedMenu] = useState<
    Array<FormattedMenu | string>
  >([]);
  const dispatch = useAppDispatch();
  const sideMenuStore = useAppSelector(selectSideMenu);
  const sideMenu = () => nestedMenu(sideMenuStore, location);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1280);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1280);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setFormattedMenu(sideMenu());
  }, [sideMenuStore, location.pathname]);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [simpleMenu, setSimpleMenu] = useCallbackState({
    active: false,
    hover: false,
    wrapper: false,
  });
  const [mobileMenu, setMobileMenu] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const scrollableRef = createRef<HTMLDivElement>();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleSimpleMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    if (simpleMenu.active) {
      if (wrapperRef.current) {
        wrapperRef.current.animate(
          { marginLeft: "270px" },
          { duration: 200 }
        ).onfinish = function () {
          if (wrapperRef.current) {
            wrapperRef.current.style.marginLeft = "270px";
          }
          setSimpleMenu(
            { ...simpleMenu, active: false, hover: false, wrapper: false },
            () => {
              if (wrapperRef.current) {
                wrapperRef.current.removeAttribute("style");
              }
            }
          );
        };
      }
    } else {
      setSimpleMenu({ ...simpleMenu, active: true, wrapper: true }, () => {
        if (wrapperRef.current) {
          wrapperRef.current.style.marginLeft = "270px";
          wrapperRef.current.animate(
            { marginLeft: "70px" },
            { duration: 200 }
          ).onfinish = function () {
            if (wrapperRef.current) {
              wrapperRef.current.removeAttribute("style");
            }
          };
        }
      });
    }
  };

  const toggleMobileMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    setMobileMenu(!mobileMenu);
  };

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    setScreenWidth(window.innerWidth);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const showMenu = screenWidth >= 800;

  useEffect(() => {
    if (scrollableRef.current) {
      new SimpleBar(scrollableRef.current);
    }
    setFormattedMenu(sideMenu());
  }, [sideMenuStore, location.pathname]);

  return (
    <div className="flex">
      {mobileMenu && screenWidth < 800 && (
        <div
          className="fixed inset-0 z-[998] bg-black/60 xl:hidden"
          onClick={() => setMobileMenu(false)}
        />
      )}

      <nav
        ref={menuRef}
        className={clsx([
          "fixed top-0 left-0 z-[999] overflow-hidden xl:ml-0 transition-all w-[220px] h-screen bg-primary duration-300 ease-in-out dark:bg-darkmode-800 dark:bg-none",
          showMenu ? "ml-0" : mobileMenu ? "ml-0" : "-ml-[100%]",
          "before:content-[''] before:ease-in-out xl:before:ease before:duration-300 xl:before:duration-[0s] before:transition-opacity xl:before:transition-none before:inset-0  xl:before:bg-transparent before:z-[-2] xl:before:z-0 xl:before:visible  before:bg-[length:270px_auto] before:bg-[right_3.5rem] before:animate-[0.4s_ease-in-out_0.3s_intro-divider] before:animate-fill-mode-forwards before:w-full before:h-screen xl:before:absolute before:bg-no-repeat",
          "after:content-[''] after:dark:bg-darkmode-800 xl:after:dark:bg-transparent after:bg-primary xl:after:bg-transparent after:w-full after:h-screen after:absolute after:top-0 after:left-0 xl:after:mt-[3.5rem] after:bg-gradient-to-b after:from-primary after:via-primary/70 after:to-black/10 after:dark:from-darkmode-800 after:dark:via-darkmode-800/70 transition-all duration-500 ease-in-out",
          {
            "ml-0": mobileMenu,
            "before:invisible before:opacity-0": !mobileMenu,
            "before:visible before:opacity-100": mobileMenu,
            "xl:relative": !simpleMenu.active,
            "xl:w-[70px] xl:z-[52] xl:absolute": simpleMenu.active,
            "hover:w-[220px] hover:shadow-lg hover:min-h-screen":
              simpleMenu.hover,
            "[&.hover]:w-[220px] [&.hover]:shadow-lg [&.hover]:min-h-screen":
              simpleMenu.hover,
            "[&:hover_[data-menu-title]]:flex": simpleMenu.hover,
            "[&.hover_[data-menu-title]]:flex": simpleMenu.hover,
            "[&:hover_[data-menu-divider]]:text-white/50": simpleMenu.hover,
            "[&.hover_[data-menu-divider]]:text-white/50": simpleMenu.hover,
            "[&:hover_[data-menu-divider]:before]:text-transparent":
              simpleMenu.hover,
            "[&.hover_[data-menu-divider]:before]:text-transparent":
              simpleMenu.hover,
            "[&:hover_[data-logo]]:ml-0": simpleMenu.hover,
            "[&.hover_[data-logo]]:ml-0": simpleMenu.hover,
            "[&:hover_[data-logo-text]]:opacity-100": simpleMenu.hover,
            "[&.hover_[data-logo-text]]:opacity-100": simpleMenu.hover,
            "[&:hover_[data-toggler]]:opacity-100": simpleMenu.hover,
            "[&.hover_[data-toggler]]:opacity-100": simpleMenu.hover,
          },
        ])}
      >
        <div className="pt-4 mb-4">
          <div
            className={clsx(["flex items-center h-[33px]"])}
            onClick={() => dispatch(removeItemFromLocalStorage())}
          >
            <Link
              to="/dashboard"
              className="flex items-center intro-x justify-center w-full"
            >
              {/* Full logo  */}
              <div
                className={clsx({
                  hidden: simpleMenu.active,
                  block: !simpleMenu.active,
                })}
              >
                <img
                  alt="Driver 007"
                  src={logoUrl}
                  className="w-full max-w-[150px] mx-auto"
                  data-logo
                />
              </div>

              {/* Collapsed logo */}
              <div
                className={clsx({
                  hidden: !simpleMenu.active,
                  block: simpleMenu.active,
                })}
              >
                <img
                  alt="driverLogo"
                  src={driverLogo}
                  className={clsx([
                    "w-[80px]",
                    simpleMenu.active ? "xl:ml-5" : "ml-0",
                  ])}
                  data-logo
                />
              </div>
            </Link>

            {/* Desktop menu toggle button (only visible on xl screens) */}
            {screenWidth >= 1280 && (
              <a
                href="#"
                onClick={toggleSimpleMenu}
                className={clsx([
                  "pr-5 ml-auto text-white transition-all duration-300 ease-in-out z-[5] text-opacity-70 hover:text-opacity-100",
                  simpleMenu.active &&
                    "opacity-0 transition-opacity duration-200 ease-in-out",
                ])}
                data-toggler
              >
                <Lucide
                  icon="PanelLeftClose"
                  className={clsx([
                    "w-5 h-5 transition-transform duration-300 ease-in-out text-white",
                    simpleMenu.active && "transform rotate-180",
                  ])}
                />
              </a>
            )}

            {/* Mobile close button (only visible on mobile screens) */}
            {screenWidth < 800 && (
              <a
                href="#"
                onClick={toggleMobileMenu}
                className="pr-5 ml-auto text-white transition-all duration-300 ease-in-out z-[5] text-opacity-70 hover:text-opacity-100"
              >
                <Lucide
                  icon="XCircle"
                  className="w-5 h-5 transition-transform duration-300 ease-in-out"
                />
              </a>
            )}
          </div>
        </div>
        <div
          ref={scrollableRef}
          className={clsx([
            "relative z-10 -ml-5 pl-5 pt-4 pb-5",
            "overflow-y-auto overflow-x-hidden",
            "h-[calc(100vh-70px)]",
            "scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent",
            "[-webkit-mask-image:-webkit-linear-gradient(top,rgba(0,0,0,0),_30px)]",
          ])}
        >
          <ul className="pr-2 overflow-x-hidden">
            {formattedMenu.map((menu, menuKey) =>
              typeof menu === "string" ? (
                <li
                  className={clsx([
                    "w-full my-[2px] h-5 pl-5 text-xs relative [&:not(:first-child)]:mt-6",
                    !simpleMenu.active && "text-white/50",
                    simpleMenu.active &&
                      "text-white/50 xl:text-transparent whitespace-nowrap",
                    simpleMenu.active &&
                      "xl:before:content-['...'] before:absolute before:inset-0 before:text-white/50 before:text-opacity-70 before:text-2xl before:w-full before:text-center before:-mt-3.5",
                    `opacity-0 animate-[0.4s_ease-in-out_0.1s_intro-divider] animate-fill-mode-forwards animate-delay-${
                      (menuKey + 1) * 10
                    }`,
                  ])}
                  data-menu-divider
                  key={menu + menuKey}
                >
                  {menu}
                </li>
              ) : (
                <li
                  key={menuKey}
                  onClick={(e) => {
                    if (!menu.subMenu) {
                      toggleMobileMenu(e);
                      dispatch(removeItemFromLocalStorage());
                    }
                  }}
                >
                  <Menu
                    className={clsx({
                      [`opacity-0 my-[2px] translate-x-[50px] animate-[0.4s_ease-in-out_0.1s_intro-menu] animate-fill-mode-forwards animate-delay-${
                        (menuKey + 1) * 10
                      }`]: !menu.active,
                    })}
                    menu={menu}
                    simpleMenu={simpleMenu}
                    formattedMenuState={[formattedMenu, setFormattedMenu]}
                    level="first"
                  ></Menu>
                  {menu.subMenu && (
                    <Transition
                      in={menu.activeDropdown}
                      onEnter={enter}
                      onExit={leave}
                      timeout={300}
                    >
                      <ul
                        className={clsx([
                          "bg-white/[0.2] py-1 rounded-2xl relative dark:bg-transparent",
                          "before:content-[''] before:block before:inset-0 before:bg-primary/60 before:rounded-2xl before:absolute before:z-[-1] before:dark:bg-darkmode-100/[0.2]",
                          {
                            hidden: !menu.activeDropdown,
                          },
                          { block: menu.activeDropdown },
                        ])}
                      >
                        {menu.subMenu.map((subMenu, subMenuKey) => (
                          <li
                            key={subMenuKey}
                            onClick={(e) => {
                              toggleMobileMenu(e);
                              dispatch(removeItemFromLocalStorage());
                            }}
                          >
                            <Menu
                              className={clsx({
                                [`opacity-0 translate-x-[50px] animate-[0.4s_ease-in-out_0.1s_intro-menu] animate-fill-mode-forwards animate-delay-${
                                  (subMenuKey + 1) * 10
                                }`]: !subMenu.active,
                              })}
                              menu={subMenu}
                              simpleMenu={simpleMenu}
                              formattedMenuState={[
                                formattedMenu,
                                setFormattedMenu,
                              ]}
                              level="second"
                            ></Menu>
                            {subMenu.subMenu && (
                              <Transition
                                in={subMenu.activeDropdown}
                                onEnter={enter}
                                onExit={leave}
                                timeout={300}
                              >
                                <ul
                                  className={clsx([
                                    "bg-white/[0.06] py-1 rounded-2xl relative dark:bg-transparent",
                                    "before:content-[''] before:block before:inset-0 before:bg-primary/60 before:rounded-2xl before:absolute before:z-[-1] before:dark:bg-darkmode-100/[0.2]",
                                    {
                                      hidden: !subMenu.activeDropdown,
                                    },
                                    {
                                      block: subMenu.activeDropdown,
                                    },
                                  ])}
                                >
                                  {subMenu.subMenu.map(
                                    (lastSubMenu, lastSubMenuKey) => (
                                      <li
                                        key={lastSubMenuKey}
                                        onClick={toggleMobileMenu}
                                      >
                                        <Menu
                                          className={clsx({
                                            [`opacity-0 translate-x-[50px] animate-[0.4s_ease-in-out_0.1s_intro-menu] animate-fill-mode-forwards animate-delay-${
                                              (lastSubMenuKey + 1) * 10
                                            }`]: !lastSubMenu.active,
                                          })}
                                          menu={lastSubMenu}
                                          simpleMenu={simpleMenu}
                                          formattedMenuState={[
                                            formattedMenu,
                                            setFormattedMenu,
                                          ]}
                                          level="third"
                                        ></Menu>
                                      </li>
                                    )
                                  )}
                                </ul>
                              </Transition>
                            )}
                          </li>
                        ))}
                      </ul>
                    </Transition>
                  )}
                </li>
              )
            )}
          </ul>
        </div>
      </nav>

      <div className="flex min-h-screen w-full">
        {screenWidth >= 800 && screenWidth < 1280 && (
          <aside className="w-[200px] hidden md:block bg-primary dark:bg-darkmode-800"></aside>
        )}

        <div
          ref={wrapperRef}
          onMouseEnter={() => {
            if (simpleMenu.active) {
              setSimpleMenu({ ...simpleMenu, hover: true });
            }
          }}
          onMouseLeave={() => {
            if (!simpleMenu.active) {
              setSimpleMenu({ ...simpleMenu, hover: false });
            }
          }}
          className={clsx([
            "flex-1 overflow-y-auto overflow-x-hidden h-screen",
            "pb-6 px-3 sm:px-4 xl:pl-0 xl:pr-6 max-w-full xl:max-w-none min-w-0",
            "before:content-[''] before:w-full before:h-px before:block",
            {
              "xl:ml-[70px]": simpleMenu.wrapper,
            },
          ])}
        >
          <TopBar toggleMobileMenu={toggleMobileMenu} screenWidth={0} />
          <div
            className={clsx([
              "mt-[1.2rem] rounded-[1rem] w-full min-h-screen relative px-4 sm:px-6 pt-0.5 pb-6",
              "bg-slate-100 dark:bg-darkmode-700",
            ])}
          >
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

function Menu(props: {
  className?: string;
  simpleMenu: {
    active: boolean;
    hover: boolean;
    wrapper: boolean;
  };
  menu: FormattedMenu;
  formattedMenuState: [
    (FormattedMenu | string)[],
    Dispatch<SetStateAction<(FormattedMenu | string)[]>>
  ];
  level: "first" | "second" | "third";
}) {
  const navigate = useNavigate();
  const [formattedMenu, setFormattedMenu] = props.formattedMenuState;
  const colorScheme = useAppSelector(selectColorScheme);
  return (
    <Link
      to={props?.menu?.pathname ? props.menu.pathname : "/dashboard"}
      aria-hidden="true"
      aria-label="Label"
      className={clsx([
        "h-[35px] text-[13px] flex items-center pl-5 text-white relative dark:text-slate-300",
        {
          "bg-[#132135] rounded-2xl dark:bg-[#10192d]":
            props.menu.active &&
            colorScheme === "theme-2" &&
            props.level === "first",
          "bg-[rgb(1,16,26)] rounded-2xl dark:bg-[#10192d]":
            colorScheme === "default" &&
            props.menu.active &&
            props.level === "first",
          "bg-[rgb(0,3,5)] rounded-2xl dark:bg-[#10192d]":
            colorScheme === "theme-1" &&
            props.menu.active &&
            props.level === "first",

          "bg-gray-600 rounded-2xl dark:bg-gray-700":
            props.menu.active &&
            (props.level === "second" || props.level === "third"),

          "before:content-[''] before:block before:inset-0 before:bg-[#132135]/[0.11] before:rounded-2xl before:absolute before:border-b-2 before:border-white/[0.05] before:dark:bg-darkmode-400/[0.6]":
            props.menu.active && props.level == "first",
        },
        { "text-white/70 dark:text-slate-400": !props.menu.active },
        {
          "hover:bg-primary hover:rounded-2xl hover:dark:bg-transparent hover:before:block hover:before:inset-0 hover:before:z-[-1] hover:before:bg-white/[0.1] hover:before:rounded-2xl hover:before:absolute hover:before:dark:bg-darkmode-100/20":
            !props.menu.active &&
            !props.menu.activeDropdown &&
            props.level == "first",
        },
        props.className,
      ])}
      onClick={(event: React.MouseEvent) => {
        event.preventDefault();
        linkTo(props.menu, navigate);
        setFormattedMenu([...formattedMenu]);
      }}
    >
      <div
        className={clsx({
          "z-10 dark:text-slate-300":
            props.menu.active && props.level == "first",
        })}
      >
        {props.menu.svgIcon ? (
          <img src={props.menu.svgIcon} className="w-5 h-5" alt="Icon" />
        ) : (
          <Lucide icon={props.menu.icon} className="w-5 h-5 -mt-0.5" />
        )}
      </div>
      <div
        className={clsx([
          "w-full ml-3 flex items-center",
          {
            "font-medium z-10 dark:text-slate-300":
              props.menu.active && props.level == "first",
          },
          { "font-medium": props.menu.active },
          { "xl:hidden whitespace-nowrap": props.simpleMenu.active },
        ])}
        data-menu-title
      >
        <span className={`${props.menu.active && "text-white"}`}>
          {props.menu.title}
        </span>
        {props.menu.subMenu && (
          <div
            className={clsx([
              "transition ease-in duration-100 ml-auto mr-4",
              { "transform rotate-180": props.menu.activeDropdown },
            ])}
          >
            <Lucide icon="ChevronDown" className="w-4 h-4" />
          </div>
        )}
      </div>
    </Link>
  );
}

export default Main;
