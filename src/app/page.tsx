"use client";
import { useAuth } from "~/hooks/useAuth";

const Page = () => {
  useAuth();

  return <div className="h-screen w-screen dark:bg-darkBackground" />;
};

export default Page;
