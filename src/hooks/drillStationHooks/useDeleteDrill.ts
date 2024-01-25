import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
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

      const newDrills = targetStation?.drills.filter(
        (drill) => drill.id !== drillId,
      );

      const newStation = {
        ...targetStation,
        drills: newDrills,
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
      };
    },

    onSuccess: (_, { drillId, stationId }) => {
      const previousStations: Station[] =
        queryClient.getQueryData(["stations"]) ?? [];

      const targetStation = previousStations.find(
        (station: Station) =>
          station.id === stationId && station.type === "drillStation",
      ) as DrillStationWithDrillsType;

      const newDrills = targetStation?.drills.filter(
        (drill) => drill.id !== drillId,
      );

      const newStation = {
        ...targetStation,
        drills: newDrills,
      } as DrillStationWithDrillsType;

      const newStations = previousStations.map((station) => {
        if (station.id === stationId && station.type === "drillStation") {
          return newStation;
        }
        return station;
      });

      queryClient.setQueryData(["stations"], newStations);
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
