"use client";

import { useRouter } from "next/navigation";
import test from "node:test";
import { createContext, useCallback, useContext, useState } from "react";
import { string } from "zod";
import CreateNewStationButton from "~/components/CreateNewStationButton";
import HelpButton from "~/components/HelpButton";
import NavBar from "~/components/NavBar";
import StationResponseHandler from "~/components/StationResponseHandler";
import Spacer from "~/components/utility/Spacer";
import { SessionContext } from "~/context/SessionIdContext";
import useCreateDrillStation from "~/hooks/drillStationHooks/useCreateDrillStation";
import useStationsForSession from "~/hooks/sessionsHooks/useStationsForSession";
import useCreateSkillStation from "~/hooks/skillStationHooks/useCreateSkillStation";
import { useAuth } from "~/hooks/useAuth";
import client from "~/utils/supabaseClient";

interface Props {
  params: {
    group_id: string;
    group_session_id: string;
  };
}

const Session = ({ params }: Props) => {
  useAuth();
  const router = useRouter();

  const [showContact, setShowContact] = useState(false);

  const {
    data: allStations,
    error,
    isLoading,
  } = useStationsForSession({ session_id: params.group_session_id });

  const { mutate: createNewSkillStation } = useCreateSkillStation();
  const { mutate: createNewDrillStation } = useCreateDrillStation();

  const handleCreateSkillStation = useCallback(() => {
    createNewSkillStation({
      lastOrder: allStations?.length ?? 0,
      session_id: params.group_session_id,
    });
  }, [allStations, params]);

  const handleCreateDrillStation = useCallback(() => {
    createNewDrillStation({
      lastOrder: allStations?.length ?? 0,
      session_id: params.group_session_id,
    });
  }, [allStations, params]);

  const handleLogout = () => {
    void client.auth.signOut();
    router.replace("/login");
  };

  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-start bg-background dark:bg-darkBackground">
      <NavBar />
      <SessionContext.Provider value={{ session_id: params.group_session_id }}>
        <StationResponseHandler
          error={error}
          stations={allStations}
          isLoading={isLoading}
        />
      </SessionContext.Provider>

      <Spacer />

      <div className="sticky bottom-0 flex w-full flex-row items-center justify-center gap-4 bg-[rgba(215,215,215,0.5)] px-4 py-2 backdrop-blur-md print:hidden md:bottom-0 md:px-10 md:py-5 dark:bg-opacNavbarBackground">
        <Spacer />

        <CreateNewStationButton
          onCreateSkillStation={handleCreateSkillStation}
          onCreateDrillStation={handleCreateDrillStation}
        />

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
