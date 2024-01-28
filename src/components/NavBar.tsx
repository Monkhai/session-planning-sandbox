import React from "react";

const NavBar = () => {
  return (
    <nav className="sticky top-0 z-50 flex w-full justify-center bg-navbarBackground print:hidden dark:bg-darkSecondaryBackground">
      <h1 className="p-5 text-white">Session Planning Sandbox</h1>
    </nav>
  );
};

export default NavBar;
