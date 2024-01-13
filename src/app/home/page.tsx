"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import CreateNewStationButton from "~/components/CreateNewStationButton";
import DrillStation from "~/components/DrillStations/DrillStation";
import HelpButton from "~/components/HelpButton";
import LogoutButton from "~/components/LogoutButton";
import NavBar from "~/components/NavBar";
import OnboardingDialog from "~/components/OnboardingDialog";
import StationResponseHandler from "~/components/StationResponseHandler";
import Spacer from "~/components/utility/Spacer";
import useCreateSkillStation from "~/hooks/useCreateSkillStation";
import useSkillStations from "~/hooks/useSkillStations";
import { useUserSeenOnboard } from "~/hooks/useUserSeenOnboard";
import { getDrillStations, getUserId } from "~/services/supabaseFunctions";
import client from "~/utils/supabaseClient";
import { drillStationType } from "~/utils/types";

export default function HomePage() {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [showContact, setShowContact] = useState(false);
  useUserSeenOnboard(dialogRef);

  const [station, setStation] = useState<drillStationType>();

  const getStation = async () => {
    const newStation = await getDrillStations();
    setStation(newStation[0]);
  };

  useEffect(() => {
    getStation();
  }, []);

  client.auth
    .getSession()
    .then(({ data }) => {
      if (!data.session) {
        client.auth.signOut();
        router.push("/login");
      }
    })
    .catch((error) => {
      console.log("error");
    });

  const stationResponse = useSkillStations();

  const { mutate: createStation } = useCreateSkillStation();

  const handleCreateStation = async () => {
    createStation();
  };

  const handleLogout = async () => {
    client.auth.signOut();
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

      <StationResponseHandler stationResponse={stationResponse} />

      {station && <DrillStation station={station} />}

      <Spacer />

      <div className="sticky bottom-10 mt-10 flex w-full flex-row items-center justify-center gap-4 px-10 print:hidden">
        <LogoutButton handleLogout={handleLogout} />
        <CreateNewStationButton onClick={handleCreateStation} />
        <HelpButton setShowContact={setShowContact} showContact={showContact} />
      </div>

      <OnboardingDialog
        dialogRef={dialogRef}
        onOnboardSeen={handleSeenOnboard}
      />
    </main>
  );
}
