"use client";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import CreateNewStationButton from "~/components/CreateNewStationButton";
import HelpButton from "~/components/HelpButton";
import LogoutButton from "~/components/LogoutButton";
import NavBar from "~/components/NavBar";
import OnboardingDialog from "~/components/OnboardingDialog";
import StationResponseHandler from "~/components/StationResponseHandler";
import Spacer from "~/components/utility/Spacer";
import useCreateDrillStation from "~/hooks/drillStationHooks/useCreateDrillStation";
import useCreateSkillStation from "~/hooks/skillStationHooks/useCreateSkillStation";
import useStations from "~/hooks/skillStationHooks/useStations";
import { useAuth } from "~/hooks/useAuth";
import client from "~/utils/supabaseClient";

export default function HomePage() {
  useAuth();
  const router = useRouter();

  const [showContact, setShowContact] = useState(false);

  const { data: allStations, error, isLoading } = useStations();

  const { mutate: createNewSkillStation } = useCreateSkillStation();

  const { mutate: createNewDrillStation } = useCreateDrillStation();
  const handleCreateSkillStation = useCallback(() => {
    createNewSkillStation(allStations?.length ?? 0);
  }, [allStations]);

  const handleCreateDrillStation = useCallback(() => {
    createNewDrillStation(allStations?.length ?? 0);
  }, [allStations]);

  const handleLogout = () => {
    void client.auth.signOut();
    router.replace("/login");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-background pb-4  dark:bg-darkBackground">
      <NavBar />

      <StationResponseHandler
        error={error}
        stations={allStations}
        isLoading={isLoading}
      />

      <Spacer />

      <div className="sticky bottom-10 mt-10 flex w-full flex-row items-center justify-center gap-4 px-10 print:hidden">
        <LogoutButton handleLogout={handleLogout} />

        <CreateNewStationButton
          onCreateSkillStation={handleCreateSkillStation}
          onCreateDrillStation={handleCreateDrillStation}
        />

        <HelpButton setShowContact={setShowContact} showContact={showContact} />
      </div>

      <OnboardingDialog />
    </main>
  );
}
