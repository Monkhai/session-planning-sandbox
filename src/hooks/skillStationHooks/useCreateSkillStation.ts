import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import createSkillStation from "~/services/backend/stations/skillStations/createSkillStation";
import { queryKeyFactory } from "~/utils/queryFactories";
import { SkillStationWithSkillsType } from "~/utils/types";

const useCreateSkillStation = () => {
  return useMutation({
    mutationFn: async ({
      lastOrder,
      session_id,
    }: {
      lastOrder: number;
      session_id: string;
    }) => {
      return await createSkillStation(lastOrder, session_id);
    },

    onMutate: ({ lastOrder, session_id }) => {
      const queryKey = queryKeyFactory.stations({ session_id });
      queryClient.cancelQueries({
        queryKey: queryKey,
      });
      const previousStations = queryClient.getQueryData(queryKey) ?? [];
      const tempId = Math.floor(Math.random() * 1000000000);

      const newStation = {
        id: tempId,
        name: "",
        duration: "00:00:00",
        order: lastOrder,
        skills: [],
        show_duration: true,
        type: "skillStation",
      };

      queryClient.setQueryData(
        queryKey,
        (old: SkillStationWithSkillsType[] | undefined) => {
          if (old === undefined) {
            return [newStation];
          }
          return [...old, newStation];
        },
      );

      return {
        rollback: () => queryClient.setQueryData(queryKey, previousStations),
        optimisticStation: newStation,
        queryKey,
      };
    },

    onSuccess: (newStation, _, { optimisticStation, queryKey }) => {
      const previousStations: SkillStationWithSkillsType[] =
        queryClient.getQueryData(queryKey) ?? [];

      const newStations = previousStations.map((station) => {
        if (
          station.id === optimisticStation.id &&
          station.type === "skillStation"
        ) {
          return newStation[0];
        }
        return station;
      });

      queryClient.setQueryData(queryKey, newStations);
    },

    onError: (error, _, context) => {
      if (context) {
        context.rollback();
        return error;
      }
    },
  });
};

export default useCreateSkillStation;
