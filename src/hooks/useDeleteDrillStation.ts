import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteDrillStation,
  getAllStations,
} from "~/services/supabaseFunctions";
import { Station } from "~/utils/types";

const useDeleteDrillStation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (station_id: number) => {
      await deleteDrillStation(station_id);
      return await getAllStations();
    },

    onMutate: async (station_id: number) => {
      const previousStations: Station[] =
        queryClient.getQueryData(["stations"]) || [];

      const newStations = previousStations.filter((station) => {
        return station.id !== station_id;
      });

      queryClient.setQueryData(["stations"], newStations);

      return () => {
        queryClient.setQueryData(["stations"], previousStations);
      };
    },

    onSuccess: (data) => {
      queryClient.setQueryData(["stations"], data);
    },

    onError: (error, variables, rollback) => {
      if (rollback) {
        rollback();
      }
      return error;
    },
  });
};

export default useDeleteDrillStation;
