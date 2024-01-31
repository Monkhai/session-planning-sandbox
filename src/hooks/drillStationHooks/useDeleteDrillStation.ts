import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import deleteMultipleDrills from "~/services/backend/drills/deleteMultipleDrills";
import DeleteAllDrillMedia from "~/services/backend/drills/media/DeleteAllDrillMedia";
import decrementStationOrder from "~/services/backend/stations/decrementStationOrder";
import deleteStation from "~/services/backend/stations/deleteStation";
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
      session_id: string;
    }) => {
      if (deleteMedia) {
        for (const id of drillsId) {
          await DeleteAllDrillMedia(id);
        }
      }
      if (drillsId) {
        await deleteMultipleDrills(drillsId);
      }
      return await deleteStation(station_id);
    },

    onMutate: async ({ station_id, session_id }) => {
      queryClient.cancelQueries({
        queryKey: ["sessions", session_id, "stations"],
      });

      const previousStations: Station[] =
        queryClient.getQueryData(["sessions", session_id, "stations"]) ?? [];

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

      queryClient.setQueryData(
        ["sessions", session_id, "stations"],
        newStationsWithUpdatedOrder,
      );

      return {
        rollback: () =>
          queryClient.setQueryData(
            ["sessions", session_id, "stations"],
            previousStations,
          ),
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
