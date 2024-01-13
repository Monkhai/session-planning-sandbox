import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllStations,
  updateSkillStation,
} from "~/services/supabaseFunctions";
import { SkillStationType, updateStationArgs } from "~/utils/types";

const useUpdateSkillStation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["stations"],
    mutationFn: async ({
      duration,
      name,
      show_duration,
      station_id,
    }: updateStationArgs) => {
      await updateSkillStation(station_id, duration, name, show_duration);
      return await getAllStations();
    },

    onMutate: ({
      duration,
      name,
      show_duration,
      station_id,
    }: updateStationArgs) => {
      const previousStations: SkillStationType[] =
        queryClient.getQueryData(["stations"]) ?? [];

      const newStations = previousStations.map((station) => {
        if (station.id === station_id && station.type === "skillStation") {
          return {
            ...station,
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

export default useUpdateSkillStation;
