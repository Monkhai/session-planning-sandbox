import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import decrementAthleteOrder from "~/services/backend/athletes/decrementAthleteOrder";
import deleteAthlete from "~/services/backend/athletes/deleteAthlete";
import { queryKeyFactory } from "~/utils/queryFactories";
import { AthleteFromDB } from "~/utils/types";

const useDeleteAthlete = () => {
  return useMutation({
    mutationFn: async ({
      athlete_id,
    }: {
      athlete_id: number;
      group_id: string;
    }) => {
      await deleteAthlete(athlete_id);
    },

    onMutate: async ({ athlete_id, group_id }) => {
      const queryKey = queryKeyFactory.groupAthletes({ group_id });
      queryClient.cancelQueries({ queryKey: queryKey });

      const previousAthletes: AthleteFromDB[] =
        queryClient.getQueryData(queryKey) ?? [];

      const index = previousAthletes.findIndex(
        (athlete: AthleteFromDB) => athlete.id === athlete_id,
      );

      const newAthletes = previousAthletes.filter(
        (athlete: AthleteFromDB) => athlete.id !== athlete_id,
      );

      const athletesToUpdate = newAthletes.slice(index);

      const newAthletesWithUpdatedOrder = newAthletes.map((athlete) => {
        if (athlete.order > index) {
          return { ...athlete, order: athlete.order - 1 };
        }
        return athlete;
      });

      queryClient.setQueryData(queryKey, newAthletesWithUpdatedOrder);

      return {
        rollback: () => queryClient.setQueryData(queryKey, previousAthletes),
        athletesToUpdate: athletesToUpdate,
      };
    },

    onSuccess: async (_, __, { rollback, athletesToUpdate }) => {
      try {
        for (const athlete of athletesToUpdate) {
          await decrementAthleteOrder(athlete);
        }
      } catch (error) {
        console.error(error);
        rollback();
      }
    },

    onError: (error, _, context) => {
      console.error(error);
      if (context) {
        context.rollback();
      }
    },
  });
};

export default useDeleteAthlete;
