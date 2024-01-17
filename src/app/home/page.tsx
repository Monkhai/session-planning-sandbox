"use client";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import CreateNewStationButton from "~/components/CreateNewStationButton";
import HelpButton from "~/components/HelpButton";
import NavBar from "~/components/NavBar";
import OnboardingDialog from "~/components/OnboardingDialog";
import StationResponseHandler from "~/components/StationResponseHandler";
import Spacer from "~/components/utility/Spacer";
import { FetchContext } from "~/context/FetchContext";
import { useAuth } from "~/hooks/useAuth";
import useCreateDrillStation from "~/hooks/useCreateDrillStation";
import useCreateSkillStation from "~/hooks/useCreateSkillStation";
import useStations from "~/hooks/useStations";
import client from "~/utils/supabaseClient";

export default function HomePage() {
  useAuth();
  const router = useRouter();

  const [showContact, setShowContact] = useState(false);

  const { data: allStations, error, isLoading, fetchStatus } = useStations();

  const { mutate: createSkillStation, isPending: isPendingCreateSkillStation } =
    useCreateSkillStation();
  const { mutate: createDrillStation, isPending: isPendingCreateDrillStation } =
    useCreateDrillStation();

  const handleCreateSkillStation = useCallback(() => {
    createSkillStation(allStations?.length ?? 0);
  }, [allStations]);

  const handleCreateDrillStation = useCallback(() => {
    createDrillStation(allStations?.length ?? 0);
  }, [allStations]);

  const handleLogout = () => {
    void client.auth.signOut();
    router.replace("/login");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-background  pb-4">
      <NavBar />

      <FetchContext.Provider
        value={{
          fetchStatus,
          isPendingCreateSkillStation,
          isPendingCreateDrillStation,
        }}
      >
        <StationResponseHandler
          error={error}
          stations={allStations}
          isLoading={isLoading}
        />
      </FetchContext.Provider>

      <Spacer />

      <div className="sticky bottom-10 mt-10 flex w-full flex-row items-center justify-center gap-4 px-10 print:hidden">
        {/* <LogoutButton handleLogout={handleLogout} /> */}
        <Spacer />
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
