import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import updateSkillsOrder from "~/services/backend/skills/updateSkillsOrder";
import { queryKeyFactory } from "~/utils/queryFactories";
import { SkillType, Station } from "~/utils/types";

type Args = {
  session_id: string;
  skills: SkillType[];
};

const useUpdateSkillsOrder = () => {
  return useMutation({
    mutationFn: async ({ skills }: Args) => {
      return await updateSkillsOrder(skills);
    },

    onMutate: ({ session_id, skills }) => {
      const queryKey = queryKeyFactory.stations({ session_id });

      const previousStations: Station[] =
        queryClient.getQueryData(queryKey) ?? [];

      const station = previousStations.find(
        (station) =>
          station.type === "skillStation" &&
          station.id === skills[0]?.station_id,
      );

      if (!station) {
        throw new Error("No station found");
      }

      const newStation = {
        ...station,
        skills: skills,
      };

      const newStations = previousStations.map((station) => {
        if (station.id === newStation.id) {
          return newStation;
        }
        return station;
      });

      queryClient.setQueryData(queryKey, newStations);

      return {
        rollback: () => queryClient.setQueryData(queryKey, previousStations),
        queryKey,
      };
    },

    onSuccess: async (data, _, { queryKey }) => {
      if (!data) {
        throw new Error("No data returned from updateSkillsOrder");
      }

      const previousStations: Station[] =
        queryClient.getQueryData(queryKey) ?? [];

      const newStations = previousStations.map((station) => {
        if (
          station.type === "skillStation" &&
          station.id === data[0]?.station_id
        ) {
          return {
            ...station,
            skills: data,
          };
        }
        return station;
      });

      queryClient.setQueryData(queryKey, newStations);
    },

    onError: (error, _, context) => {
      console.error(error);
      if (context) context.rollback();
    },
  });
};

export default useUpdateSkillsOrder;
