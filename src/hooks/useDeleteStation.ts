import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteStation, getStations } from "~/services/supabaseFunctions";
import { Station } from "~/utils/types";

const useDeleteStation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (station_id: number) => {
      await deleteStation(station_id);
      const data = await getStations();
      return data;
    },

    onMutate: (station_id: number) => {
      queryClient.cancelQueries({ queryKey: ["stations"] });

      const previousStations = queryClient.getQueryData(["stations"]) || [];

      queryClient.setQueryData(["stations"], (old: Station[] | undefined) => {
        if (old === undefined) {
          return [];
        }

        return old.filter((station: Station) => station.id !== station_id);
      });

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

export default useDeleteStation;
