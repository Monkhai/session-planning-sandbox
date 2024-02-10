import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import updateAthlete from "~/services/backend/athletes/updateAthlete";
import updateGroup from "~/services/backend/groups/updateGroup";
import { queryKeyFactory } from "~/utils/queryFactories";
import { AthleteFromDB, GroupFromDB } from "~/utils/types";

const useUpdateAthlete = () => {
  return useMutation({
    mutationFn: async ({
      athlete_id,
      name,
    }: {
      group_id: string;
      athlete_id: string;
      name: string;
    }) => {
      return await updateAthlete(Number(athlete_id), name);
    },

    onMutate: async ({ athlete_id, name, group_id }) => {
      const queryKey = queryKeyFactory.groupAthletes({ group_id });
      const previousAthletes: AthleteFromDB[] =
        queryClient.getQueryData(queryKey) ?? [];

      const updatedGroups = previousAthletes.map((athlete) => {
        if (athlete.id === Number(athlete_id)) {
          return { ...athlete, name };
        }
        return athlete;
      });

      queryClient.setQueryData(queryKey, updatedGroups);

      return {
        rollback: () => queryClient.setQueryData(queryKey, previousAthletes),
        queryKey,
      };
    },

    onSuccess: async (data, { athlete_id }, { queryKey }) => {
      if (!data) {
        throw new Error("No data returned from updateSession");
      }

      const previousGroups: AthleteFromDB[] =
        queryClient.getQueryData(queryKey) ?? [];

      const updatedGroups = previousGroups.map((group) => {
        if (group.id === Number(athlete_id)) {
          return data;
        }
        return group;
      });

      queryClient.setQueryData(queryKey, updatedGroups);
    },

    onError: (error, _, context) => {
      console.error(error);
      if (context) {
        context.rollback();
      }
      return error;
    },
  });
};

export default useUpdateAthlete;
