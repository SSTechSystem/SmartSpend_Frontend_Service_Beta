import { selectDarkMode, setDarkMode } from "../../stores/darkModeSlice";
import { useAppSelector, useAppDispatch } from "../../stores/hooks";
import clsx from "clsx";

function Main() {
  const dispatch = useAppDispatch();
  const darkMode = useAppSelector(selectDarkMode);

  const setDarkModeClass = () => {
    const el = document.querySelectorAll("html")[0];
    darkMode ? el.classList.add("dark") : el.classList.remove("dark");
  };

  const switchMode = () => {
    dispatch(setDarkMode(!darkMode));
    localStorage.setItem("darkMode", (!darkMode).toString());
    setDarkModeClass();
  };

  setDarkModeClass();

  return (
    <div className="fixed bottom-0 right-0 z-50 flex p-2 items-center justify-center space-y-1 rounded-2xl  mb-8 mr-9 bg-slate-800  dark:bg-[#374151] shadow-md cursor-pointer">
      {/* Dark Mode Switcher  */}
      <div
        className={clsx([
          "border w-[38px] h-[24px] p-px  rounded-2xl relative",
          "before:content-[''] before:w-[23px] before:h-[20px] before:bg-white before:transition-all before:duration-200 before:shadow-[1px_1px_3px_rgba(0,0,0,0.25)] before:absolute before:inset-y-0 before:my-auto before:rounded-full",
          {
            "bg-primary border-primary": darkMode,
            "before:ml-[13px] before:bg-white": darkMode,
          },
        ])}
        onClick={switchMode}
      ></div>
      {/* END: Dark Mode Switcher */}
    </div>
  );
}

export default Main;