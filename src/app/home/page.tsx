"use client";
import Link from "next/link";
import React, { useEffect } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { PiDotsThreeCircleFill } from "react-icons/pi";
import CreateNewSessionButton from "~/components/CreateNewSessionButton";
import Loader from "~/components/Loader";
import NavBar from "~/components/NavBar";
import SessionRow from "~/components/Sessions/SessionRow";
import Spacer from "~/components/utility/Spacer";
import useCreateSession from "~/hooks/sessionsHooks/useCreateSession";
import useGetSessions from "~/hooks/sessionsHooks/useGetSessions";

const page = () => {
  const { data: sessions, isLoading } = useGetSessions();
  const { mutate: createNewSession } = useCreateSession();

  const handleCreateNewSession = (name: string) => {
    createNewSession({ name: name, lastOrder: sessions?.length || 0 });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen flex-1 items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-start bg-background dark:bg-darkBackground">
      <NavBar />

      <div className="flex w-3/4 flex-col pt-4 md:w-1/2">
        {sessions &&
          sessions.map((session, index) => {
            const isLast = session.id == sessions[sessions.length - 1].id;
            return (
              <SessionRow
                key={session.id}
                session={session}
                index={index}
                isLast={isLast}
              />
            );
          })}
      </div>

      <Spacer />

      <div className="sticky bottom-0 flex w-full flex-row items-center justify-center gap-4 bg-[rgba(215,215,215,0.5)] px-4 py-2 backdrop-blur-md print:hidden md:bottom-0 md:px-10 md:py-5 dark:bg-opacNavbarBackground">
        <CreateNewSessionButton onCreateNewSession={handleCreateNewSession} />
      </div>
    </main>
  );
};

export default page;
