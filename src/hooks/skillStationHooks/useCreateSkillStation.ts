import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import createSkillStation from "~/services/backend/stations/skillStations/createSkillStation";
import getUserId from "~/services/backend/userManagement/getUserId";
import { queryKeyFactory } from "~/utils/queryFactories";
import { SkillStationWithSkillsType, Station } from "~/utils/types";

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

      const previousStations: Station[] =
        queryClient.getQueryData(queryKey) ?? [];

      const user_id = getUserId();

      if (!user_id) {
        throw new Error("No user id found");
      }

      const tempId = Math.floor(Math.random() * 1000000000);

      const newStation = {
        id: tempId,
        name: "",
        duration: "00:00:00",
        order: lastOrder,
        skills: [],
        show_duration: true,
        type: "skillStation",
        user_id,
      } as Station;

      const newStations = [...previousStations, newStation];

      queryClient.setQueryData(queryKey, newStations);

      return {
        rollback: () => queryClient.setQueryData(queryKey, previousStations),
        optimisticStation: newStation,
        queryKey,
      };
    },

    onSuccess: (newStation, _, { optimisticStation, queryKey }) => {
      const previousStations: Station[] =
        queryClient.getQueryData(queryKey) ?? [];

      const newStations: Station[] = previousStations.map((station) => {
        if (station.id === optimisticStation.id) {
          return {
            ...newStation,
            skills: [],
          } as Station;
        }
        return station;
      });

      queryClient.setQueryData(queryKey, newStations);
    },

    onError: (error, _, context) => {
      console.error(error);
      if (context) {
        context.rollback();
      }
    },
  });
};

export default useCreateSkillStation;
