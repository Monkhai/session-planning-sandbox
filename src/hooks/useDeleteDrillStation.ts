import { queryOptions, useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import {
  deleteDrillStation,
  deleteStationMedia,
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
      return await deleteDrillStation(station_id);
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

    onSuccess: (_, { station_id }) => {
      const previousStations: Station[] =
        queryClient.getQueryData(["stations"]) ?? [];

      const newStations = previousStations.filter((station) => {
        return station.id !== station_id || station.type !== "drillStation";
      });

      queryClient.setQueryData(["stations"], newStations);
    },

    onError: (error, _, rollback) => {
      if (rollback) {
        rollback();
      }
      return error;
    },
  });
};

export default useDeleteDrillStation;
