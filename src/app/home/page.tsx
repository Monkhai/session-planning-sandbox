"use client";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import CreateNewStationButton from "~/components/CreateNewStationButton";
import HelpButton from "~/components/HelpButton";
import LogoutButton from "~/components/LogoutButton";
import NavBar from "~/components/NavBar";
import OnboardingDialog from "~/components/OnboardingDialog";
import StationResponseHandler from "~/components/StationResponseHandler";
import Spacer from "~/components/utility/Spacer";
import { useAuth } from "~/hooks/useAuth";
import useCreateDrillStation from "~/hooks/useCreateDrillStation";
import useCreateSkillStation from "~/hooks/useCreateSkillStation";
import useStations from "~/hooks/useStations";
import { useUserSeenOnboard } from "~/hooks/useUserSeenOnboard";
import { getUserId } from "~/services/supabaseFunctions";
import client from "~/utils/supabaseClient";

export default function HomePage() {
  const router = useRouter();
  useAuth();

  const dialogRef = useRef<HTMLDialogElement>(null);
  const [showContact, setShowContact] = useState(false);

  useUserSeenOnboard(dialogRef);

  const { data: allStations, error, isLoading } = useStations();

  const { mutate: createSkillStation } = useCreateSkillStation();
  const { mutate: createDrillStation } = useCreateDrillStation();

  const handleCreateSkillStation = () => {
    createSkillStation(allStations?.length ?? 0);
  };

  const handleCreateDrillStation = () => {
    createDrillStation(allStations?.length ?? 0);
  };

  const handleLogout = () => {
    void client.auth.signOut();
    router.replace("/login");
  };

  const handleSeenOnboard = async () => {
    dialogRef.current?.close();
    try {
      const userId = await getUserId();
      const { error } = await client
        .from("user_data")
        .update({ seen_onboard: true })
        .eq("user_id", userId);

      if (error) {
        console.error(error);
        return;
      }
    } catch (error) {
      const e = error as Error;
      console.log(e.message);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-background  pb-4">
      <NavBar />

      {allStations ? (
        <StationResponseHandler
          error={error}
          stations={allStations}
          isLoading={isLoading}
        />
      ) : null}

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

      <OnboardingDialog
        dialogRef={dialogRef}
        onOnboardSeen={handleSeenOnboard}
      />
    </main>
  );
}
