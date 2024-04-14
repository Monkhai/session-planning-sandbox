"use client";
import Link from "next/link";
import Spacer from "./utility/Spacer";
import { usePathname, useRouter } from "next/navigation";
import { IoChevronBack } from "react-icons/io5";

interface Props {
  title?: string;
}
const NavBar = ({ title = "FlexiPlan" }: Props) => {
  const router = useRouter();
  const handleBack = () => router.back();

  const currentRoute = usePathname();

  const isHome = currentRoute === "/home";

  return (
    <nav className="sticky bottom-0 flex w-full flex-row items-center justify-center gap-4 bg-[rgba(215,215,215,0.5)]  backdrop-blur-md print:hidden  dark:bg-opacNavbarBackground">
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
