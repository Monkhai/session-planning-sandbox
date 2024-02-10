"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import HelpButton from "~/components/HelpButton";
import NavBar from "~/components/NavBar";
import Spacer from "~/components/utility/Spacer";
import { useAuth } from "~/hooks/useAuth";
import client from "~/utils/supabaseClient";

const page = () => {
  useAuth();
  const [showContact, setShowContact] = React.useState(false);

  const router = useRouter();

  const handleLogout = () => {
    void client.auth.signOut();
    router.replace("/login");
  };

  return (
    <main className="relative flex h-[100dvh] flex-col items-center justify-start bg-background dark:bg-darkBackground">
      <NavBar />

      <Link href={"/groups"}>
        <h2>Go To Groups!</h2>
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
