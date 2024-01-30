import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import createDrill from "~/services/backend/drills/createDrill";
import createDrillStation from "~/services/backend/stations/drillStations/createDrillStation";
import getUserId from "~/services/backend/userManagement/getUserId";
import { DrillStationWithDrillsType, DrillType } from "~/utils/types";

const useCreateDrillStation = () => {
  return useMutation({
    mutationFn: async ({
      lastOrder,
      session_id,
    }: {
      lastOrder: number;
      session_id: string;
    }) => {
      const newStation = await createDrillStation(lastOrder, session_id);

      const stationId = newStation[0]?.id;
      if (stationId === undefined) {
        throw new Error("stationId is undefined");
      }
      const drill = await createDrill(stationId, 1);
      return { newStation, drill };
    },

    onMutate: ({ lastOrder, session_id }) => {
      queryClient.cancelQueries({
        queryKey: ["sessions", session_id, "stations"],
      });

      const user_id = getUserId();

      const previousStations =
        queryClient.getQueryData(["sessions", session_id, "stations"]) ?? [];
      const tempId = Math.floor(Math.random() * 1000000000);
      const newDrill = {
        id: tempId,
        drillOfStationId: tempId,
        description: "",
        station_id: tempId,
        name: "",
        order: 0,
        user_id: user_id,
        show_reps: true,
        comments: "",
        duration: "00:00:00",
        show_comments: false,
        show_media: false,
        show_edit_media: false,
        type: "drillStation",
        show_duration: true,
      } as DrillType;

      const newStation = {
        id: tempId,
        name: "",
        duration: "00:00:00",
        order: lastOrder,
        drills: [newDrill],
        show_duration: true,
        type: "drillStation",
        user_id: user_id,
      } as DrillStationWithDrillsType;

      queryClient.setQueryData(
        ["sessions", session_id, "stations"],
        (old: DrillStationWithDrillsType[] | undefined) => {
          if (old === undefined) {
            return [newStation];
          }
          return [...old, newStation];
        },
      );

      return {
        rollback: () =>
          queryClient.setQueryData(
            ["sessions", session_id, "stations"],
            previousStations,
          ),
        optimisticStation: newStation,
      };
    },

    onSuccess: (
      { newStation, drill },
      { session_id },
      { optimisticStation },
    ) => {
      const previousStations: DrillStationWithDrillsType[] =
        queryClient.getQueryData(["sessions", session_id, "stations"]) ?? [];

      const newDrillStation = {
        ...newStation[0],
        drills: [drill],
      } as DrillStationWithDrillsType;

      const newStations = previousStations.map((station) => {
        if (
          station.id === optimisticStation.id &&
          station.type === "drillStation"
        ) {
          return newDrillStation;
        }
        return station;
      });

      queryClient.setQueryData(
        ["sessions", session_id, "stations"],
        newStations,
      );
    },

    onError: (error, _, context) => {
      if (context) {
        context.rollback();
        return error;
      }
    },
  });
};

export default useCreateDrillStation;
