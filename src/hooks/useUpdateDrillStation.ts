import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import {
  getAllStations,
  updateDrillStation,
} from "~/services/supabaseFunctions";
import { Station, UpdateDrillStationArgs } from "~/utils/types";

const useUpdateDrillStation = () => {
  return useMutation({
    mutationFn: async ({
      comments,
      despcription,
      duration,
      name,
      show_duration,
      station_id,
      show_comments,
      show_media,
      show_edit_media,
    }: UpdateDrillStationArgs) => {
      await updateDrillStation({
        comments,
        despcription,
        duration,
        name,
        show_duration,
        station_id,
        show_comments,
        show_media,
        show_edit_media,
      });
      return await getAllStations();
    },
    onMutate: async ({
      comments,
      despcription,
      duration,
      name,
      show_duration,
      station_id,
      show_comments,
      show_media,
      show_edit_media,
    }: UpdateDrillStationArgs) => {
      queryClient.cancelQueries({ queryKey: ["stations"] });

      const previousStations: Station[] =
        queryClient.getQueryData(["stations"]) ?? [];

      const newStations: Station[] = previousStations.map((station) => {
        if (station.id === station_id && station.type === "drillStation") {
          return {
            ...station,
            comments: comments,
            description: despcription,
            duration: duration,
            name: name,
            show_duration: show_duration,
            show_comments: show_comments,
            show_media: show_media,
            show_edit_media: show_edit_media,
          } as Station;
        }
        return station;
      });

      queryClient.setQueryData(["stations"], newStations);

      return () => {
        queryClient.setQueryData(["stations"], previousStations);
      };
    },

    onSuccess: (data) => {
      // queryClient.setQueryData(["stations"], data);
      queryClient.invalidateQueries({ queryKey: ["stations"] });
    },

    onError: (error, _, rollback) => {
      if (rollback) {
        rollback();
      }
      return error;
    },
  });
};

export default useUpdateDrillStation;
