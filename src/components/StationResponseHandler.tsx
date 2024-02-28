import { useRouter } from "next/navigation";
import React, { useContext } from "react";
import client from "~/utils/supabaseClient";
import {
  DrillStationWithDrillsType,
  SkillStationWithSkillsType,
  Station,
} from "~/utils/types";
import DrillStationHandler from "./DrillStations/DrillStationHandler";
import Loader from "./Loader";
import SkillStation from "./SkillStation/SkillStation";
import { Reorder } from "framer-motion";
import { queryKeyFactory } from "~/utils/queryFactories";
import { SessionContext } from "~/context/SessionIdContext";
import { queryClient } from "Providers/ReactQueryProvider";
import useUpdateStationsOrder from "~/hooks/useUpdateStationsOrder";

interface Props {
  stations: Station[] | undefined;
  error: Error | null;
  isLoading: boolean;
}

const StationResponseHandler = ({ error, isLoading, stations }: Props) => {
  const router = useRouter();
  const { session_id } = useContext(SessionContext);

  const { mutate: updateStationsOrder } = useUpdateStationsOrder();
  if (isLoading) {
    return (
      <div className="flex h-full w-full flex-1 items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    if (error.message === "No user id found") {
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

  const handleReorder = (newStations: Station[]) => {
    console.log(newStations);
    const queryKey = queryKeyFactory.stations({ session_id });
    queryClient.setQueryData(queryKey, newStations);
  };

  const handleReorderEnd = () => {
    if (stations) {
      updateStationsOrder({ stations, session_id });
    }
  };

  if (stations && stations.length > 0) {
    return (
      <Reorder.Group
        values={stations}
        onReorder={(values) => handleReorder(values)}
        axis="y"
        className="flex w-full flex-col gap-4 pt-4"
      >
        {stations.map((station, index) => {
          const isLast = stations.length - 1 === index;
          if (station.type === "skillStation") {
            return (
              <SkillStation
                onReorderEnd={handleReorderEnd}
                key={station.id + station.type}
                isLast={isLast}
                station={station as SkillStationWithSkillsType}
              />
            );
          } else if (station.type === "drillStation") {
            return (
              <DrillStationHandler
                onReorderEnd={handleReorderEnd}
                key={station.id + station.type}
                isLast={isLast}
                station={station as DrillStationWithDrillsType}
              />
            );
          }
        })}
      </Reorder.Group>
    );
  }

  return null;
};

export default React.memo(StationResponseHandler);
