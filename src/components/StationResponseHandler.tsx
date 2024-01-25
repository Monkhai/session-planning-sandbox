import { useRouter } from "next/navigation";
import React from "react";
import client from "~/utils/supabaseClient";
import {
  DrillStationType,
  DrillStationWithDrillsType,
  SkillStationWithSkillsType,
  Station,
} from "~/utils/types";
import CircuitStation from "./DrillStations/CircuitStation";
import Loader from "./Loader";
import SkillStation from "./SkillStation/SkillStation";
import DrillStationHandler from "./DrillStations/DrillStationHandler";

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

  if (stations && stations.length === 0) {
    return (
      <div className="flex h-full w-full flex-1 items-center justify-center">
        <h3 className="text-xl font-semibold">
          Create a New Station to Start!
        </h3>
      </div>
    );
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
                station={station as SkillStationWithSkillsType}
              />
            );
          } else if (station.type === "drillStation") {
            return (
              <DrillStationHandler
                key={station.id + station.type}
                isLast={isLast}
                station={station as DrillStationWithDrillsType}
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
