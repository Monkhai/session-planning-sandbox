import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import {
  deleteDrillStation,
  deleteMedia,
  deleteStationMedia,
  getAllStations,
} from "~/services/supabaseFunctions";
import { Station } from "~/utils/types";

const useDeleteDrillStation = () => {
  return useMutation({
    mutationFn: async ({
      deleteMedia,
      station_id,
    }: {
      station_id: number;
      deleteMedia: boolean;
    }) => {
      if (deleteMedia) {
        await deleteStationMedia(station_id);
      }
      await deleteDrillStation(station_id);
      // return await getAllStations();
    },

    onMutate: async ({ station_id }) => {
      queryClient.cancelQueries({ queryKey: ["stations"] });

      const previousStations: Station[] =
        queryClient.getQueryData(["stations"]) ?? [];

      const newStations = previousStations.filter((station) => {
        return station.id !== station_id || station.type !== "drillStation";
      });

      queryClient.setQueryData(["stations"], newStations);

      return () => {
        queryClient.setQueryData(["stations"], previousStations);
      };
    },

    onSuccess: (data) => {
      // queryClient.setQueryData(["stations"], data);
      queryClient.invalidateQueries({ queryKey: ["stations"] });
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
