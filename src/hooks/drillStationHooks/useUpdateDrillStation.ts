import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import updateStation from "~/services/backend/stations/updateStation";
import { queryKeyFactory } from "~/utils/queryFactories";

import { SkillStationType, updateStationArgs } from "~/utils/types";

const useUpdateDrillStation = () => {
  return useMutation({
    mutationFn: async ({
      duration,
      name,
      show_duration,
      station_id,
      order,
    }: updateStationArgs) => {
      await updateStation({
        duration,
        name,
        show_duration,
        station_id,
        order: order,
      });
    },

    onMutate: ({
      duration,
      name,
      show_duration,
      station_id,
      session_id,
      order,
    }: updateStationArgs) => {
      const queryKey = queryKeyFactory.stations({ session_id });
      queryClient.cancelQueries({
        queryKey: queryKey,
      });

      const previousStations: SkillStationType[] =
        queryClient.getQueryData(queryKey) ?? [];

      const newStations = previousStations.map((station) => {
        if (station.id === station_id && station.type === "drillStation") {
          return {
            ...station,
            duration: duration,
            name: name,
            show_duration: show_duration,
            order: order,
          };
        }
        return station;
      });

      queryClient.setQueryData(queryKey, newStations);

      return () => {
        queryClient.setQueryData(queryKey, previousStations);
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
