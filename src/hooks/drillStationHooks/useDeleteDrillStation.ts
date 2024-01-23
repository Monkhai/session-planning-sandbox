import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import deleteMultipleDrills from "~/services/backend/drills/deleteMultipleDrills";
import DeleteAllDrillMedia from "~/services/backend/drills/media/DeleteAllDrillMedia";
import decrementStationOrder from "~/services/backend/stations/decrementStationOrder";
import deleteDrillStation from "~/services/backend/stations/drillStations/deleteDrillStation";
import { Station } from "~/utils/types";

const useDeleteDrillStation = () => {
  return useMutation({
    mutationFn: async ({
      deleteMedia,
      station_id,
      drillsId,
    }: {
      station_id: number;
      deleteMedia: boolean;
      drillsId: number[];
    }) => {
      if (deleteMedia) {
        await DeleteAllDrillMedia(station_id);
      }
      if (drillsId) {
        await deleteMultipleDrills(drillsId);
      }
      return await deleteDrillStation(station_id);
    },

    onMutate: async ({ station_id }) => {
      queryClient.cancelQueries({ queryKey: ["stations"] });

      const previousStations: Station[] =
        queryClient.getQueryData(["stations"]) ?? [];

      const index = previousStations.findIndex(
        (station) =>
          station.id === station_id && station.type === "drillStation",
      );

      const newStations = previousStations.filter((station) => {
        return station.id !== station_id || station.type !== "drillStation";
      });

      const stationsToUpdate = newStations.slice(index);

      const newStationsWithUpdatedOrder = newStations.map((station) => {
        if (station.order > index) {
          return { ...station, order: station.order - 1 };
        }
        return station;
      });

      queryClient.setQueryData(["stations"], newStationsWithUpdatedOrder);

      return {
        rollback: () =>
          queryClient.setQueryData(["stations"], previousStations),
        stationsToUpdate: stationsToUpdate,
      };
    },

    onSuccess: async (_, __, { rollback, stationsToUpdate }) => {
      try {
        for (const station of stationsToUpdate) {
          await decrementStationOrder(station);
        }
      } catch (error) {
        console.error(error);
        rollback();
      }
      return;
    },

    onError: (error, _, context) => {
      console.error(error);
      if (context) {
        context.rollback();
      }
    },
  });
};

export default useDeleteDrillStation;
