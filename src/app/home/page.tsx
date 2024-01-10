"use client";
import { useRouter } from "next/navigation";
import CreateNewStationButton from "~/components/CreateNewStationButton";
import NavBar from "~/components/NavBar";
import StationResponseHandler from "~/components/StationResponseHandler";
import Spacer from "~/components/utility/Spacer";
import useCreateStation from "~/hooks/useCreateStation";
import useStations from "~/hooks/useStations";
import client from "~/utils/supabaseClient";

export default function HomePage() {
  const router = useRouter();

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

  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-background pb-10 pb-4">
      <NavBar />

      <div className="flex w-3/6 flex-col justify-center gap-8"></div>

      <StationResponseHandler stationResponse={stationResponse} />
      <Spacer />

      <div className="sticky bottom-10 mt-10 flex gap-4">
        <CreateNewStationButton onClick={handleCreateStation} />
      </div>

      <button
        onClick={handleLogout}
        className="absolute bottom-10 left-10 rounded-[12px] bg-primary p-4 transition-all duration-150 active:scale-95"
      >
        <p className="text-center text-lg text-white">Logout</p>
      </button>
    </main>
  );
}
