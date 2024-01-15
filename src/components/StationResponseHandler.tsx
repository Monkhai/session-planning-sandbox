import { FetchStatus, UseQueryResult } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import client from "~/utils/supabaseClient";
import { SkillStationType, Station, drillStationType } from "~/utils/types";
import React, { useEffect } from "react";
import SkillStation from "./SkillStation/SkillStation";
import DrillStation from "./DrillStations/DrillStation";

interface Props {
  stations: Station[];
  error: Error | null;
  isLoading: boolean;
}

const StationResponseHandler = ({ error, isLoading, stations }: Props) => {
  const router = useRouter();

  if (isLoading) {
    return null;
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
                station={station as drillStationType}
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
