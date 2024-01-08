import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getStations,
  updateStationDuration,
} from "~/services/supabaseFunctions";
import { Station } from "~/utils/types";

type EditStationDurationArgs = {
  station_id: number;
  stationDuration: string | null;
};

const useEditStationDuration = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      station_id,
      stationDuration,
    }: EditStationDurationArgs) => {
      await updateStationDuration(station_id, stationDuration);
      return await getStations();
    },

    onMutate: ({
      stationDuration: NewStationDuration,
      station_id,
    }: EditStationDurationArgs) => {
      const previousStations = queryClient.getQueryData(["stations"]) || [];

      queryClient.setQueryData(["stations"], (old: Station[]) => {
        if (old === undefined) {
          return [];
        }

        return old.map((station: Station) => {
          if (station.id === station_id) {
            return { ...station, duration: NewStationDuration };
          }
          return station;
        });
      });

      return () => queryClient.setQueryData(["stations"], previousStations);
    },

    onSuccess: (data) => {
      queryClient.setQueryData(["stations"], data);
    },

    onError: (error, _, rollback) => {
      if (rollback) {
        rollback();
        return error;
      }
    },
  });
};
export default useEditStationDuration;
