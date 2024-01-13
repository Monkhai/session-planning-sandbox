import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllStations,
  updateDrillStation,
} from "~/services/supabaseFunctions";
import { Station, UpdateDrillStationArgs } from "~/utils/types";

const useUpdateDrillStation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      comments,
      despcription,
      duration,
      name,
      show_duration,
      station_id,
    }: UpdateDrillStationArgs) => {
      await updateDrillStation({
        comments,
        despcription,
        duration,
        name,
        show_duration,
        station_id,
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
    }: UpdateDrillStationArgs) => {
      const previousStations: Station[] =
        queryClient.getQueryData(["stations"]) || [];

      const newStations = previousStations.map((station) => {
        if (station.id === station_id) {
          return {
            ...station,
            comments: comments,
            description: despcription,
            duration: duration,
            name: name,
            show_duration: show_duration,
          };
        }
        return station;
      });

      queryClient.setQueryData(["stations"], newStations);

      return () => {
        queryClient.setQueryData(["stations"], previousStations);
      };
    },

    onSuccess: (data) => {
      queryClient.setQueryData(["stations"], data);
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
