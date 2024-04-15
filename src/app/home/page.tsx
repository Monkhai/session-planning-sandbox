"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import HelpButton from "~/components/HelpButton";
import Spacer from "~/components/utility/Spacer";
import { useAuth } from "~/hooks/useAuth";
import client from "~/utils/supabaseClient";
type ComplexItem = {
  id: number;
  name: string;
};
const page = () => {
  useAuth();
  const [showContact, setShowContact] = React.useState(false);

  const router = useRouter();

  const handleLogout = () => {
    void client.auth.signOut();
    router.replace("/login");
  };

  return (
    <main className="bg-background-gradient dark:bg-dark-background-gradient relative flex h-[100dvh] flex-col items-center justify-center gap-4">
      <Spacer />
      <h1>FlexiPlan</h1>
      <h3>A simple way to plan and organize your sessions</h3>
      <Link href={"/groups"}>
        <h4 className="text-primary">Go To Your Groups -&gt;</h4>
      </Link>
      <Spacer />

      <div className="sticky bottom-0 flex w-full flex-row items-center justify-center gap-4 bg-[rgba(215,215,215,0.5)] px-4 py-2 backdrop-blur-md print:hidden md:bottom-0 md:px-10 md:py-5 dark:bg-opacNavbarBackground">
        <Spacer />
        <HelpButton
          onLogout={handleLogout}
          setShowContact={setShowContact}
          showContact={showContact}
        />
      </div>
    </main>
  );
};

export default page;
