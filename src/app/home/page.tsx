"use client";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import CreateNewStationButton from "~/components/CreateNewStationButton";
import DrillStation from "~/components/DrillStations/DrillStation";
import HelpButton from "~/components/HelpButton";
import LogoutButton from "~/components/LogoutButton";
import NavBar from "~/components/NavBar";
import OnboardingDialog from "~/components/OnboardingDialog";
import StationResponseHandler from "~/components/StationResponseHandler";
import Spacer from "~/components/utility/Spacer";
import { env } from "~/env";
import useCreateSkillStation from "~/hooks/useCreateSkillStation";
import useSkillStations from "~/hooks/useSkillStations";
import { useUserSeenOnboard } from "~/hooks/useUserSeenOnboard";
import { getUserId } from "~/services/supabaseFunctions";
import client from "~/utils/supabaseClient";

export default function HomePage() {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [showContact, setShowContact] = useState(false);
  useUserSeenOnboard(dialogRef);

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

      <DrillStation
        station={{
          comments: "",
          description: "",
          duration: "",
          id: 1,
          mediaUrls: [],
          name: "",
          order: 1,
          show_duration: true,
          type: "drillStation",
          user_id: env.NEXT_PUBLIC_STATIC_USER_ID,
        }}
      />

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
