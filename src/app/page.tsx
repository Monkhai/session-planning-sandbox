"use client";
import { redirect } from "next/navigation";
import { useAuth } from "~/hooks/useAuth";

const Page = () => {
  useAuth();
  redirect("/home");
  return <div className="dark:bg-dark-background-gradient h-screen w-screen" />;
};

export default Page;
