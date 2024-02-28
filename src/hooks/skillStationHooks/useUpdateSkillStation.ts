import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import updateStation from "~/services/backend/stations/updateStation";
import { queryKeyFactory } from "~/utils/queryFactories";

import { SkillStationType } from "~/utils/types";

type Args = {
  station_id: number;
  name: string;
  duration: string | null;
  show_duration: boolean;
  session_id: string;
  order: number;
};

const useUpdateSkillStation = () => {
  return useMutation({
    mutationFn: async ({
      duration,
      name,
      show_duration,
      station_id,
      order,
    }: Args) => {
      await updateStation({
        station_id,
        duration,
        name,
        show_duration,
        order,
      });
    },

    onMutate: ({ duration, name, show_duration, station_id, session_id }) => {
      const queryKey = queryKeyFactory.stations({ session_id });
      queryClient.cancelQueries({
        queryKey: queryKey,
      });

      const previousStations: SkillStationType[] =
        queryClient.getQueryData(queryKey) ?? [];

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

      queryClient.setQueryData(queryKey, newStations);

      return () => {
        queryClient.setQueryData(queryKey, previousStations);
      };
    },

    onError: (error, _, rollback) => {
      if (rollback) {
        rollback();
      }
      console.error(error);
    },
  });
};

export default useUpdateSkillStation;
