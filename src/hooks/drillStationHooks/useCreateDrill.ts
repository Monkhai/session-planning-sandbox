import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import createDrill from "~/services/backend/drills/createDrill";
import { queryKeyFactory } from "~/utils/queryFactories";
import { DrillStationWithDrillsType, DrillType, Station } from "~/utils/types";

const useCreateDrill = () => {
  return useMutation({
    mutationFn: async ({
      lastOrder,
      stationId,
    }: {
      session_id: string;
      stationId: number;
      lastOrder: number;
    }) => {
      return await createDrill(stationId, lastOrder + 1);
    },

    onMutate: ({ lastOrder, stationId, session_id }) => {
      const queryKey = queryKeyFactory.stations({ session_id });

      const oldStations: Station[] = queryClient.getQueryData(queryKey) ?? [];

      const targetStation = oldStations.find(
        (station) =>
          station.id === stationId && station.type === "drillStation",
      ) as DrillStationWithDrillsType;

      const tempId = Math.floor(Math.random() * 1000000000);
      const tempSecondId = Math.floor(Math.random() * 1000000000);

      const newDrill = {
        id: tempId,
        drillOfStationId: tempSecondId,
        station_id: stationId,
        name: "",
        description: "",
        user_id: "",
        duration: "00:00:00",
        show_duration: true,
        show_comments: true,
        comments: "",
        show_media: false,
        show_edit_media: false,
        type: "drillStation",
        order: lastOrder + 1,
      } as DrillType;

      const newDrills = [...targetStation.drills, newDrill];

      newDrills.sort((a, b) => a.order - b.order);

      const newStation = {
        ...targetStation,
        drills: newDrills,
      };

      const newStations = oldStations.map((station) => {
        if (station.id === newStation.id && station.type === "drillStation") {
          return newStation;
        }
        return station;
      });

      queryClient.setQueryData(queryKey, newStations);

      return {
        rollback: () => queryClient.setQueryData(queryKey, oldStations),
        targetId: newDrill.id,
        queryKey,
      };
    },

    onSuccess: (newDrill, __, { rollback, targetId, queryKey }) => {
      if (!newDrill) {
        rollback();
        return;
      }

      const previousStations: Station[] =
        queryClient.getQueryData(queryKey) ?? [];

      const targetStation = previousStations.find(
        (station) =>
          station.id === newDrill.station_id && station.type === "drillStation",
      ) as DrillStationWithDrillsType;

      const newDrills = targetStation.drills.map((drill) => {
        if (drill.id === targetId) {
          return newDrill;
        }
        return drill;
      });

      const newStation = {
        ...targetStation,
        drills: newDrills,
      };

      const newStations = previousStations.map((station) => {
        if (station.id === newStation.id && station.type === "drillStation") {
          return newStation;
        }
        return station;
      });

      queryClient.setQueryData(queryKey, newStations);
    },

    onError: (error, _, context) => {
      if (!context) {
        console.error("rollback did not trigger!!!", error);
        return error;
      }
      console.error(error);
      context.rollback();
      return error;
    },
  });
};

export default useCreateDrill;
