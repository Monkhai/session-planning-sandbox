import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import decrementDrillOrder from "~/services/backend/drills/decrementDrillOrder";
import deleteDrill from "~/services/backend/drills/deleteDrill";
import DeleteAllDrillMedia from "~/services/backend/drills/media/DeleteAllDrillMedia";
import { DrillStationWithDrillsType, Station } from "~/utils/types";

const useDeleteDrill = () => {
  return useMutation({
    mutationFn: async ({
      deleteMedia,
      drillId,
      stationId,
    }: {
      drillId: number;
      deleteMedia: boolean;
      stationId: number;
    }) => {
      if (deleteMedia) {
        await DeleteAllDrillMedia(drillId);
      }
      return await deleteDrill(drillId);
    },

    onMutate: ({ drillId, stationId }) => {
      queryClient.cancelQueries({ queryKey: ["stations"] });
      const previousStations: Station[] =
        queryClient.getQueryData(["stations"]) ?? [];

      const targetStation = previousStations.find(
        (station: Station) =>
          station.id === stationId && station.type === "drillStation",
      ) as DrillStationWithDrillsType;

      const index = targetStation.drills.findIndex(
        (drill) => drill.id === drillId,
      );

      const drillsToUpdate = targetStation.drills.slice(index);

      const newDrills = targetStation?.drills.filter(
        (drill) => drill.id !== drillId,
      );

      const updatedDrills = newDrills.map((drill) => {
        if (drill.order > index) {
          return { ...drill, order: drill.order - 1 };
        }
        return drill;
      });

      const newStation = {
        ...targetStation,
        drills: updatedDrills,
      } as DrillStationWithDrillsType;

      const newStations = previousStations.map((station) => {
        if (station.id === stationId && station.type === "drillStation") {
          return newStation;
        }
        return station;
      });

      queryClient.setQueryData(["stations"], newStations);

      return {
        rollback: () =>
          queryClient.setQueryData(["stations"], previousStations),
        drillsToUpdate: drillsToUpdate,
      };
    },

    onSuccess: async (_, __, { drillsToUpdate }) => {
      try {
        for (const drill of drillsToUpdate) {
          await decrementDrillOrder(drill);
        }
      } catch (error) {
        throw error;
      }

      return;
    },

    onError: (error, _, context) => {
      if (context) {
        context.rollback();
        return error;
      }
    },
  });
};

export default useDeleteDrill;
