import { UseQueryResult } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import client from "~/utils/supabaseClient";
import { Station } from "~/utils/types";
import StationComponent from "./Station";

interface Props {
  stationResponse: UseQueryResult<Station[], Error>;
}

const StationResponseHandler = ({ stationResponse }: Props) => {
  const router = useRouter();
  const { data, error, isLoading } = stationResponse;

  if (isLoading) {
    return null;
  }
  if (error) {
    if (stationResponse.error.message === "No user id found") {
      console.log("redirecting");
      client.auth.signOut();
      router.push("/login");
    }
    return <div>Error: {error.message}</div>;
  }
  if (data) {
    return (
      <div className="w-3/6 pt-4">
        {data.map((station) => {
          return <StationComponent key={station.id} station={station} />;
        })}
      </div>
    );
  }
  return null;
};

export default StationResponseHandler;
