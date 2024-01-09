"use client";
import Link from "next/link";
import CreateNewStationButton from "~/components/CreateNewStationButton";
import StationResponseHandler from "~/components/StationResponseHandler";
import Spacer from "~/components/utility/Spacer";
import useCreateStation from "~/hooks/useCreateStation";
import useStations from "~/hooks/useStations";

export default function HomePage() {
  const stationResponse = useStations();
  const { mutate: createStation } = useCreateStation();

  const handleCreateStation = async () => {
    createStation();
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-background py-4 pb-10">
      <h1 className="text-6xl font-bold">Welcome Someone!</h1>
      <div className="flex w-3/6 flex-col justify-center gap-8"></div>

      <StationResponseHandler stationResponse={stationResponse} />
      <Spacer />

      <div className="sticky bottom-10 mt-10">
        <CreateNewStationButton onClick={handleCreateStation} />
      </div>
    </main>
  );
}
