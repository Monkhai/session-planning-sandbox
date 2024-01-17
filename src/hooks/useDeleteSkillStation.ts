import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import { deleteSkillStation } from "~/services/supabaseFunctions";
import { Station } from "~/utils/types";

const useDeleteSkillStation = () => {
  return useMutation({
    mutationFn: async (station_id: number) => {
      await deleteSkillStation(station_id);
    },

    onMutate: (station_id: number) => {
      queryClient.cancelQueries({ queryKey: ["stations"] });

      const previousStations: Station[] =
        queryClient.getQueryData(["stations"]) ?? [];

      const newStations = previousStations.filter((station) => {
        return station.type !== "skillStation" || station.id !== station_id;
      });

      queryClient.setQueryData(["stations"], newStations);

      return () => queryClient.setQueryData(["stations"], previousStations);
    },

    onSuccess: (_, station_id) => {
      const previousStations: Station[] =
        queryClient.getQueryData(["stations"]) ?? [];

      const newStations = previousStations.filter((station) => {
        return station.type !== "skillStation" || station.id !== station_id;
      });

      queryClient.setQueryData(["stations"], newStations);
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
