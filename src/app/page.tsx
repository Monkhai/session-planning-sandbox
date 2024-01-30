"use client";
import { redirect } from "next/navigation";
import { useAuth } from "~/hooks/useAuth";

const Page = () => {
  useAuth();
  redirect("/home");
  return <div className="h-screen w-screen dark:bg-darkBackground" />;
};

export default Page;
