"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import CreateNewStationButton from "~/components/CreateNewStationButton";
import LogoutButton from "~/components/LogoutButton";
import NavBar from "~/components/NavBar";
import OnboardingDialog from "~/components/OnboardingDialog";
import StationResponseHandler from "~/components/StationResponseHandler";
import Spacer from "~/components/utility/Spacer";
import useCreateStation from "~/hooks/useCreateStation";
import useStations from "~/hooks/useStations";
import { getUserId } from "~/services/supabaseFunctions";
import client from "~/utils/supabaseClient";

export default function HomePage() {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const userSeenOnboard = async () => {
      const userId = await getUserId();
      const { data, error } = await client
        .from("user_data")
        .select("seen_onboard")
        .eq("user_id", userId);

      if (error) {
        console.error(error);
        return;
      }

      if (data) {
        const seenOnboard = data[0]?.seen_onboard || false;
        if (!seenOnboard) {
          dialogRef.current?.showModal();
        }
      }
    };
    userSeenOnboard();
  }, []);

  client.auth.getSession().then(({ data }) => {
    if (!data.session) {
      client.auth.signOut();
      router.push("/login");
    }
  });

  const stationResponse = useStations();

  const { mutate: createStation } = useCreateStation();

  const handleCreateStation = async () => {
    createStation();
  };

  const handleLogout = async () => {
    client.auth.signOut();
    router.replace("/login");
  };

  const handleSeenOnboard = async () => {
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

    dialogRef.current?.close();
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-background  pb-4">
      <NavBar />

      <StationResponseHandler stationResponse={stationResponse} />

      <Spacer />

      <div className="sticky bottom-10 mt-10 flex w-full flex-row items-center justify-center gap-4 px-10 print:hidden">
        <LogoutButton handleLogout={handleLogout} />
        <CreateNewStationButton onClick={handleCreateStation} />
        <Spacer />
      </div>

      {/* ---------------------------------------- */}
      <OnboardingDialog
        dialogRef={dialogRef}
        onOnboardSeen={handleSeenOnboard}
      />
    </main>
  );
}
