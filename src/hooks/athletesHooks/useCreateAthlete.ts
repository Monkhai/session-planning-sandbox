import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import createNewAthlete from "~/services/backend/athletes/createNewAthlete";
import getUserId from "~/services/backend/userManagement/getUserId";
import { queryKeyFactory } from "~/utils/queryFactories";
import { AthleteFromDB } from "~/utils/types";

const useCreateAthlete = () => {
  return useMutation({
    mutationFn: async ({
      lastOrder,
      name,
      group_id,
    }: {
      name: string;
      lastOrder: number;
      group_id: string;
    }) => {
      return await createNewAthlete(Number(group_id), name, lastOrder);
    },

    onMutate: async ({ lastOrder, name, group_id }) => {
      const queryKey = queryKeyFactory.groupAthletes({ group_id });

      const user_id = getUserId();

      if (!user_id) {
        throw new Error("User not logged in");
      }

      queryClient.cancelQueries({ queryKey: queryKey });

      const previousAthletes: AthleteFromDB[] =
        queryClient.getQueryData(queryKey) ?? [];

      const tempId = Math.random() * 1000000;

      const newAthlete = {
        id: tempId,
        user_id,
        name,
        order: lastOrder + 1,
      };

      const newAthletes = [...previousAthletes, newAthlete];

      queryClient.setQueryData(queryKey, newAthletes);

      return {
        rollback: () => {
          queryClient.setQueryData(queryKey, previousAthletes);
        },
        athleteToReplace: newAthlete,
        queryKey,
      };
    },

    onSuccess: (data, _, { athleteToReplace, queryKey }) => {
      const previousAthletes: AthleteFromDB[] =
        queryClient.getQueryData(queryKey) ?? [];

      const newAthletes = previousAthletes.map((athlete) => {
        if (athlete.id === athleteToReplace.id) {
          return data;
        }

        return athlete;
      });

      queryClient.setQueryData(queryKey, newAthletes);
    },

    onError: (error, _, context) => {
      if (context) {
        context.rollback();
      }

      console.error(error);
    },
  });
};

export default useCreateAthlete;
