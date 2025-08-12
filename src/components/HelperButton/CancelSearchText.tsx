import React from "react";
import Lucide from "../../base-components/Lucide";

interface CancelSearchProps {
  setSearchText: (value: React.SetStateAction<string>) => void;
}

const CancelSearchText: React.FC<CancelSearchProps> = ({ setSearchText }) => {
  return (
    <Lucide
      icon="X"
      className="absolute inset-y-0 right-0 w-[1.2rem] h-[1.2rem] my-auto mr-3 cursor-pointer dark:text-white hover:text-white hover:bg-slate-500 hover:rounded-full transition-all duration-300 ease-in"
      onClick={() => setSearchText("")}
    />
  );
};

export default CancelSearchText;
