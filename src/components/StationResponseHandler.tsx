import { useRouter } from "next/navigation";
import React from "react";
import client from "~/utils/supabaseClient";
import { DrillStationType, SkillStationType, Station } from "~/utils/types";
import DrillStation from "./DrillStations/DrillStation";
import Loader from "./Loader";
import SkillStation from "./SkillStation/SkillStation";

interface Props {
  stations: Station[] | undefined;
  error: Error | null;
  isLoading: boolean;
}

const StationResponseHandler = ({ error, isLoading, stations }: Props) => {
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex h-full w-full flex-1 items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    if (error.message === "No user id found") {
      console.log("redirecting");
      client.auth.signOut();
      router.push("/login");
    }
    return <div>Error: {error.message}</div>;
  }

  if (stations && stations.length > 0) {
    return (
      <div className="flex w-full flex-col gap-4 pt-4">
        {stations.map((station, index) => {
          const isLast = stations.length - 1 === index;
          if (station.type === "skillStation") {
            return (
              <SkillStation
                key={station.id + station.type}
                isLast={isLast}
                station={station as SkillStationType}
              />
            );
          } else if (station.type === "drillStation") {
            return (
              <DrillStation
                key={station.id + station.type}
                isLast={isLast}
                station={station as DrillStationType}
              />
            );
          }
        })}
      </div>
    );
  }

  return null;
};

export default React.memo(StationResponseHandler);
