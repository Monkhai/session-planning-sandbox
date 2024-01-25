import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import createDrill from "~/services/backend/drills/createDrill";
import { DrillStationWithDrillsType, DrillType, Station } from "~/utils/types";

const useCreateDrill = () => {
  return useMutation({
    mutationFn: async ({
      lastOrder,
      stationId,
    }: {
      stationId: number;
      lastOrder: number;
    }) => {
      return await createDrill(stationId, lastOrder + 1);
    },

    onMutate: ({
      lastOrder,
      stationId,
    }: {
      stationId: number;
      lastOrder: number;
    }) => {
      const oldStations: Station[] =
        queryClient.getQueryData(["stations"]) ?? [];

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

      queryClient.setQueryData(["stations"], newStations);

      return () => queryClient.setQueryData(["stations"], oldStations);
    },

    onSuccess: (newDrill, _, rollback) => {
      if (!newDrill) {
        rollback();
        return;
      }

      const previousStations: Station[] =
        queryClient.getQueryData(["stations"]) ?? [];

      const targetStation = previousStations.find(
        (station) =>
          station.id === newDrill.station_id && station.type === "drillStation",
      ) as DrillStationWithDrillsType;

      const newDrills = targetStation.drills.map((drill) => {
        if (drill.id === newDrill.id) {
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

      queryClient.setQueryData(["stations"], newStations);
    },

    onError: (error, _, rollback) => {
      if (!rollback) {
        console.error("rollback did not trigger!!!", error);
        return error;
      }
      console.error(error);
      rollback();
      return error;
    },
  });
};

export default useCreateDrill;
