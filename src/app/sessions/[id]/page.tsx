"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import CreateNewStationButton from "~/components/CreateNewStationButton";
import HelpButton from "~/components/HelpButton";
import NavBar from "~/components/NavBar";
import StationResponseHandler from "~/components/StationResponseHandler";
import Spacer from "~/components/utility/Spacer";
import useCreateDrillStation from "~/hooks/drillStationHooks/useCreateDrillStation";
import useStationsForSession from "~/hooks/sessionsHooks/useStationsForSession";
import useCreateSkillStation from "~/hooks/skillStationHooks/useCreateSkillStation";
import { useAuth } from "~/hooks/useAuth";
import client from "~/utils/supabaseClient";

interface Props {
  params: {
    id: string;
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
  } = useStationsForSession(params.id);

  const { mutate: createNewSkillStation } = useCreateSkillStation();
  const { mutate: createNewDrillStation } = useCreateDrillStation();

  const handleCreateSkillStation = useCallback(() => {
    createNewSkillStation({
      lastOrder: allStations?.length ?? 0,
      session_id: params.id,
    });
  }, [allStations]);

  const handleCreateDrillStation = useCallback(() => {
    createNewDrillStation({
      lastOrder: allStations?.length ?? 0,
      session_id: params.id,
    });
  }, [allStations]);

  const handleLogout = () => {
    void client.auth.signOut();
    router.replace("/login");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-background dark:bg-darkBackground">
      <StationResponseHandler
        error={error}
        stations={allStations}
        isLoading={isLoading}
      />

      <Spacer />

      <div className="dark:bg-opacNavbarBackground sticky bottom-0 flex w-full flex-row items-center justify-center gap-4 bg-[rgba(215,215,215,0.5)] px-4 py-2 backdrop-blur-md print:hidden md:bottom-0 md:px-10 md:py-5">
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
