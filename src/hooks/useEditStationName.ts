import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getStations, updateStationName } from "~/services/supabaseFunctions";
import { Station, UpdateStationNameArgs } from "~/utils/types";

const useEditStationName = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ station_id, stationName }: UpdateStationNameArgs) => {
      await updateStationName(station_id, stationName);
      return await getStations();
    },

    onMutate: ({
      stationName: newStationName,
      station_id,
    }: UpdateStationNameArgs) => {
      const previousStations = queryClient.getQueryData(["stations"]) || [];

      queryClient.setQueryData(["stations"], (old: Station[]) => {
        return old.map((station: Station) => {
          if (station.id === station_id) {
            return { ...station, name: newStationName };
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
export default useEditStationName;
