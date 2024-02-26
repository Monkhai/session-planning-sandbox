"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import HelpButton from "~/components/HelpButton";
import NavBar from "~/components/NavBar";
import SessionList from "~/components/athleteSessions/SessionList";
import CreateNewSessionButton from "~/components/groups/CreateNewGroupSessionButton";
import Spacer from "~/components/utility/Spacer";
import useCreateAthleteSession from "~/hooks/athletesHooks/useCreateAthleteSession";
import useGetAthleteSessions from "~/hooks/athletesHooks/useGetAthleteSessions";
import useGetOneAthlete from "~/hooks/athletesHooks/useGetOneAthlete";
import { useAuth } from "~/hooks/useAuth";
import client from "~/utils/supabaseClient";

interface Props {
  params: {
    athlete_id: string;
    group_id: string;
  };
}

const Session = ({ params }: Props) => {
  useAuth();
  const router = useRouter();

  const {
    data: athlete,
    isLoading: isAthleteLoading,
    error: athleteError,
  } = useGetOneAthlete({
    athlete_id: params.athlete_id,
    group_id: params.group_id,
  });

  const navBarTitle = useMemo(() => {
    if (isAthleteLoading || !athlete || athleteError) {
      return "Gymnastics Session Planner";
    }

    return athlete.name;
  }, [athlete, isAthleteLoading, athleteError]);

  const { data: sessions, isLoading: areSessionsLoading } =
    useGetAthleteSessions({
      athlete_id: params.athlete_id,
      group_id: params.group_id,
    });
  const { mutate: createAthleteSession } = useCreateAthleteSession();

  const [showContact, setShowContact] = useState(false);

  const handleLogout = () => {
    void client.auth.signOut();
    router.replace("/login");
  };

  const handleCreateNewSession = (name: string) => {
    createAthleteSession({
      athlete_id: params.athlete_id,
      group_id: params.group_id,
      name: name,
      lastOrder: sessions?.length || 0,
    });
  };

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-start bg-background dark:bg-darkBackground">
      <NavBar title={navBarTitle} />

      <SessionList
        sessions={sessions}
        areSessionsLoading={areSessionsLoading}
      />
      <Spacer />

      <div className="sticky bottom-0 flex w-full flex-row items-center justify-center gap-4 bg-[rgba(215,215,215,0.5)] px-4 py-2 backdrop-blur-md print:hidden md:bottom-0 md:px-10 md:py-5 dark:bg-opacNavbarBackground">
        <Spacer />

        <div className="flex flex-row gap-4 md:gap-24">
          <CreateNewSessionButton onCreateNewSession={handleCreateNewSession} />
        </div>

        <HelpButton
          onLogout={handleLogout}
          setShowContact={setShowContact}
          showContact={showContact}
        />
      </div>
    </main>
  );
};

export default Session;
