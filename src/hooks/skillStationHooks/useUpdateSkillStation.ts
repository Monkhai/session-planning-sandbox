import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import updateSkillStation from "~/services/backend/stations/skillStations/updateSkillStation";

import { SkillStationType, updateStationArgs } from "~/utils/types";

const useUpdateSkillStation = () => {
  return useMutation({
    mutationKey: ["stations"],
    mutationFn: async ({
      duration,
      name,
      show_duration,
      station_id,
    }: updateStationArgs) => {
      await updateSkillStation(station_id, duration, name, show_duration);
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

export default useUpdateSkillStation;