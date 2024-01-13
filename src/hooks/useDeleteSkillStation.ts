import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteSkillStation,
  getAllStations,
} from "~/services/supabaseFunctions";
import { Station } from "~/utils/types";

const useDeleteSkillStation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (station_id: number) => {
      await deleteSkillStation(station_id);
      return await getAllStations();
    },

    onMutate: (station_id: number) => {
      queryClient.cancelQueries({ queryKey: ["stations"] });

      const previousStations: Station[] =
        queryClient.getQueryData(["stations"]) || [];

      const newStations = previousStations.filter((station) => {
        return station.id !== station_id && station.type !== "skillStation";
      });

      queryClient.setQueryData(["stations"], newStations);

      return () => queryClient.setQueryData(["stations"], previousStations);
    },

    onSuccess: (data) => {
      queryClient.setQueryData(["stations"], data);
    },

    onError: (error, _, rollback) => {
      console.error(error.message);
      if (rollback) {
        rollback();
        return error;
      }
    },
  });
};

export default useDeleteSkillStation;
