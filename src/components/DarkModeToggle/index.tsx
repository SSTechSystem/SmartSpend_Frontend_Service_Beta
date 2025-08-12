import React, { useState } from "react";
import DarkModeSwitcher from "../DarkModeSwitcher";
import MainColorSwitcher from "../MainColorSwitcher";
import clsx from "clsx";
type Props = {};

const DarkModeToggle: React.FC = (props: Props) => {
  const [toggle, setToggle] = useState<Boolean>(false);
  return (
    <>
      <div>
        <div
          className={clsx({
            "hover:border-slate-200": toggle,
          })}
          onMouseEnter={() => setToggle(true)}
            onMouseLeave={() => setToggle(false)}
        >
          <DarkModeSwitcher />
          {toggle && <MainColorSwitcher />}
        </div>
        {/* <div
          className={clsx({
            "border-slate-200": toggle,
          })}
          onMouseEnter={() => setToggle(true)}
          onMouseLeave={() => setToggle(false)}
        >
          {toggle && <MainColorSwitcher />}
        </div> */}
      </div>
    </>
  );
};

export default DarkModeToggle;
