import React from "react";

interface Props {
  handleLogout: () => void;
}

const LogoutButton = ({ handleLogout }: Props) => {
  return (
    <div className="flex flex-1 items-center justify-start">
      <button
        onClick={handleLogout}
        className="rounded-[10px] bg-primary p-3 transition-all duration-150 active:scale-95 print:hidden  md:p-4"
      >
        <p className="text-center text-base text-white md:text-lg">Logout</p>
      </button>
    </div>
  );
};

export default LogoutButton;
