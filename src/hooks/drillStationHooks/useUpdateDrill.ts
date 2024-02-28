import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import updateDrill from "~/services/backend/drills/updateDrill";
import { queryKeyFactory } from "~/utils/queryFactories";
import { DrillStationWithDrillsType, DrillType, Station } from "~/utils/types";

type Args = {
  drill_id: number;
  duration: string | null;
  name: string;
  show_duration: boolean;
  description: string;
  comments: string;
  show_comments: boolean;
  show_media: boolean;
  show_edit_media: boolean;
  station_id: number;
  session_id: string;
  drillOfStationId: number;
  order: number;
};
const useUpdateDrill = () => {
  return useMutation({
    mutationFn: async ({
      comments,
      description,
      drill_id,
      duration,
      name,
      show_comments,
      show_duration,
      show_edit_media,
      show_media,
      station_id,
      session_id,
      drillOfStationId,
      order,
    }: Args) => {
      return await updateDrill({
        drill_id,
        name,
        comments,
        description,
        duration,
        show_comments,
        show_duration,
        show_edit_media,
        show_media,
        station_id,
        session_id,
        drillOfStationId,
        order,
      });
    },

    onMutate: ({
      comments,
      description,
      drill_id,
      duration,
      name,
      show_comments,
      show_duration,
      show_edit_media,
      show_media,
      station_id,
      session_id,
    }) => {
      const queryKey = queryKeyFactory.stations({ session_id });
      queryClient.cancelQueries({
        queryKey: queryKey,
      });

      const previousStations: Station[] =
        queryClient.getQueryData(queryKey) ?? [];

      const targetStation =
        (previousStations.find(
          (station) =>
            station.id === station_id && station.type === "drillStation",
        ) as DrillStationWithDrillsType) || undefined;

      if (targetStation === undefined) {
        return;
      }

      const targetDrill = targetStation.drills.find(
        (drill) => drill.id === drill_id,
      );

      if (targetDrill === undefined) {
        return;
      }

      const newDrill = {
        ...targetDrill,
        comments,
        description,
        duration,
        name,
        show_comments,
        show_duration,
        show_edit_media,
        show_media,
      } as DrillType;

      const newDrills = targetStation.drills.map((drill) => {
        if (drill.id === drill_id) {
          return newDrill;
        }
        return drill;
      });

      const newStation = {
        ...targetStation,
        drills: newDrills,
      };

      const newStations = previousStations.map((station) => {
        if (station.id === station_id && station.type === "drillStation") {
          return newStation;
        }
        return station;
      });

      queryClient.setQueryData(queryKey, newStations);

      return () => {
        queryClient.setQueryData(queryKey, previousStations);
      };
    },

    onError: (error, _, rollback) => {
      console.error(error);
      if (rollback) {
        rollback();
      }
      return error;
    },
  });
};

export default useUpdateDrill;
