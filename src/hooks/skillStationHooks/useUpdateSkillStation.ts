import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import updateStation from "~/services/backend/stations/updateStation";

import { SkillStationType, updateStationArgs } from "~/utils/types";

const useUpdateSkillStation = () => {
  return useMutation({
    mutationFn: async ({
      duration,
      name,
      show_duration,
      station_id,
    }: updateStationArgs) => {
      await updateStation(station_id, duration, name, show_duration);
    },

    onMutate: ({
      duration,
      name,
      show_duration,
      station_id,
      session_id,
    }: updateStationArgs) => {
      queryClient.cancelQueries({
        queryKey: ["sessions", session_id, "stations"],
      });

      const previousStations: SkillStationType[] =
        queryClient.getQueryData(["sessions", session_id, "stations"]) ?? [];

      const newStations = previousStations.map((station) => {
        if (station.id === station_id && station.type === "skillStation") {
          return {
            ...station,
            duration: duration,
            name: name,
            show_duration: show_duration,
          };
        }
        return station;
      });

      queryClient.setQueryData(
        ["sessions", session_id, "stations"],
        newStations,
      );

      return () => {
        queryClient.setQueryData(
          ["sessions", session_id, "stations"],
          previousStations,
        );
      };
    },

    onError: (error, _, rollback) => {
      if (rollback) {
        rollback();
      }
      return error;
    },
  });
};

export default useUpdateSkillStation;
