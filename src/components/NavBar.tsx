"use client";
import Link from "next/link";
import Spacer from "./utility/Spacer";
import { usePathname, useRouter } from "next/navigation";
import { IoChevronBack } from "react-icons/io5";

interface Props {
  title?: string;
}
const NavBar = ({ title = "Gymnastics Session Planner" }: Props) => {
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
          <h3 className="text-white">Back</h3>
        </button>
      ) : null}
      <Link className="flex-[ 2 ] flex justify-center" href="/home">
        <h1 className="p-5 text-white">{title}</h1>
      </Link>

      {!isHome ? <Spacer /> : null}
    </nav>
  );
};

export default NavBar;
