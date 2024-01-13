import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteSkillStation,
  getSkillStations,
} from "~/services/supabaseFunctions";
import { SkillStationType } from "~/utils/types";

const useDeleteSkillStation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (station_id: number) => {
      await deleteSkillStation(station_id);
      const data = await getSkillStations();
      return data;
    },

    onMutate: (station_id: number) => {
      queryClient.cancelQueries({ queryKey: ["stations"] });

      const previousStations = queryClient.getQueryData(["stations"]) || [];

      queryClient.setQueryData(
        ["stations"],
        (old: SkillStationType[] | undefined) => {
          if (old === undefined) {
            return [];
          }

          return old.filter(
            (station: SkillStationType) => station.id !== station_id,
          );
        },
      );

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
