import { useMemo } from "react";
import { useAppSelector } from "../../stores/hooks";
import { selectDarkMode } from "../../stores/darkModeSlice";

interface LoadingIconProps {
  icon: "three-dots" | "puff";
  color?: string;
}

const Loader = (props: LoadingIconProps) => {
  const darkMode = useAppSelector(selectDarkMode);

  const iconColor = useMemo(() => {
    if (props.icon === "puff" || props.icon === "three-dots") {
      return !darkMode ? "#000" : "#ffffff"; // #000 for light mode and #ffffff for dark mode
    }
  }, [darkMode, props.icon, props.color]);

  return (
    <div
      className={`w-12 sm:w-24 p-2 text-center mt-10 flex mx-auto justify-center iconColor={props.color :"#dswewr"}`}
    >
      <svg
        width="25"
        viewBox="0 0 44 44"
        xmlns="http://www.w3.org/2000/svg"
        stroke={iconColor}
        className="w-full h-full"
      >
        <g fill="none" fillRule="evenodd" strokeWidth="4">
          <circle cx="22" cy="22" r="1">
            <animate
              attributeName="r"
              begin="0s"
              dur="1.8s"
              values="1; 20"
              calcMode="spline"
              keyTimes="0; 1"
              keySplines="0.165, 0.84, 0.44, 1"
              repeatCount="indefinite"
            />
            <animate
              attributeName="stroke-opacity"
              begin="0s"
              dur="1.8s"
              values="1; 0"
              calcMode="spline"
              keyTimes="0; 1"
              keySplines="0.3, 0.61, 0.355, 1"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="22" cy="22" r="1">
            <animate
              attributeName="r"
              begin="-0.9s"
              dur="1.8s"
              values="1; 20"
              calcMode="spline"
              keyTimes="0; 1"
              keySplines="0.165, 0.84, 0.44, 1"
              repeatCount="indefinite"
            />
            <animate
              attributeName="stroke-opacity"
              begin="-0.9s"
              dur="1.8s"
              values="1; 0"
              calcMode="spline"
              keyTimes="0; 1"
              keySplines="0.3, 0.61, 0.355, 1"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      </svg>
    </div>
  );
};

export default Loader;
