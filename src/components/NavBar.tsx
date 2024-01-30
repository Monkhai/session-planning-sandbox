"use client";
import Link from "next/link";
import Spacer from "./utility/Spacer";
import { usePathname, useRouter } from "next/navigation";
import { IoChevronBack } from "react-icons/io5";

const NavBar = () => {
  const router = useRouter();
  const handleBack = () => router.back();

  const currentRoute = usePathname();

  const isHome = currentRoute === "/home";

  return (
    <nav className="sticky top-0 z-50 flex w-full flex-row items-center justify-center border-2 bg-navbarBackground print:hidden dark:bg-darkSecondaryBackground">
      {!isHome ? (
        <button
          className=" flex flex-1 flex-row items-center"
          onClick={handleBack}
        >
          <IoChevronBack color="white" size={32} />
          <h2 className="text-white">Back</h2>
        </button>
      ) : null}
      <Link className="flex flex-1 justify-center" href="/home">
        <h1 className="p-5 text-white">Session Planning Sandbox</h1>
      </Link>

      {!isHome ? <Spacer /> : null}
    </nav>
  );
};

export default NavBar;
