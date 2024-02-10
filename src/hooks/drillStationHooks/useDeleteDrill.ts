import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import decrementDrillOrder from "~/services/backend/drills/decrementDrillOrder";
import deleteDrill from "~/services/backend/drills/deleteDrill";
import DeleteAllDrillMedia from "~/services/backend/drills/media/DeleteAllDrillMedia";
import { queryKeyFactory } from "~/utils/queryFactories";
import { DrillStationWithDrillsType, Station } from "~/utils/types";

const useDeleteDrill = () => {
  return useMutation({
    mutationFn: async ({
      deleteMedia,
      drillId,
      session_id,
    }: {
      drillId: number;
      deleteMedia: boolean;
      stationId: number;
      session_id: string;
    }) => {
      if (deleteMedia) {
        await DeleteAllDrillMedia(drillId);
      }
      return await deleteDrill(drillId);
    },

    onMutate: ({ drillId, stationId, session_id }) => {
      const queryKey = queryKeyFactory.stations({ session_id });
      queryClient.cancelQueries({
        queryKey: queryKey,
      });
      const previousStations: Station[] =
        queryClient.getQueryData(queryKey) ?? [];

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

      queryClient.setQueryData(queryKey, newStations);

      return {
        rollback: () => queryClient.setQueryData(queryKey, previousStations),
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
