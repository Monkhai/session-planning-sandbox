import React from "react";

const NavBar = () => {
  return (
    <nav className="bg-navbarBackground dark:bg-darkSecondaryBackground sticky top-0 z-50 flex w-full justify-center print:hidden">
      <h1 className="p-5 text-white">Session Planning Sandbox</h1>
    </nav>
  );
};

export default NavBar;
