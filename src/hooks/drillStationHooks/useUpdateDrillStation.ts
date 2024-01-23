import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import updateDrillStation from "~/services/backend/stations/drillStations/updateDrillStation";
import updateSkillStation from "~/services/backend/stations/skillStations/updateSkillStation";

import { SkillStationType, updateStationArgs } from "~/utils/types";

const useUpdateDrillStation = () => {
  return useMutation({
    mutationKey: ["stations"],
    mutationFn: async ({
      duration,
      name,
      show_duration,
      station_id,
    }: updateStationArgs) => {
      await updateDrillStation({ duration, name, show_duration, station_id });
    },

    onMutate: ({
      duration,
      name,
      show_duration,
      station_id,
    }: updateStationArgs) => {
      queryClient.cancelQueries({ queryKey: ["stations"] });

      const previousStations: SkillStationType[] =
        queryClient.getQueryData(["stations"]) ?? [];

      const newStations = previousStations.map((station) => {
        if (station.id === station_id && station.type === "drillStation") {
          return {
            ...station,
            duration: duration,
            name: name,
            show_duration: show_duration,
          };
        }
        return station;
      });

      queryClient.setQueryData(["stations"], newStations);

      return () => {
        queryClient.setQueryData(["stations"], previousStations);
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

export default useUpdateDrillStation;
