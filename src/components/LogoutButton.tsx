import React from "react";

interface Props {
  handleLogout: () => void;
}

const LogoutButton = ({ handleLogout }: Props) => {
  return (
    <div className="flex flex-1 items-center justify-start">
      <button
        onClick={handleLogout}
        className="rounded-[12px] bg-primary p-4 transition-all duration-150 active:scale-95  print:hidden"
      >
        <p className="text-center text-lg text-white">Logout</p>
      </button>
    </div>
  );
};

export default LogoutButton;
