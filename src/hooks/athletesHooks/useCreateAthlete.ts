import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import createNewAthlete from "~/services/backend/athletes/createNewAthlete";
import createNewGroup from "~/services/backend/groups/createNewGroup";
import createNewSession from "~/services/backend/sessions/createNewSession";
import getUserId from "~/services/backend/userManagement/getUserId";
import { AthleteFromDB, GroupFromDB, SessionFromDB } from "~/utils/types";

const useCreateAthlete = () => {
  return useMutation({
    mutationFn: async ({
      lastOrder,
      name,
      group_id,
    }: {
      name: string;
      lastOrder: number;
      group_id: number;
    }) => {
      return await createNewAthlete(group_id, name, lastOrder);
    },

    onMutate: async ({ lastOrder, name, group_id }) => {
      const user_id = getUserId();

      if (!user_id) {
        throw new Error("User not logged in");
      }

      queryClient.cancelQueries({ queryKey: ["groups", group_id, "athletes"] });

      const previousAthletes: AthleteFromDB[] =
        queryClient.getQueryData(["groups", group_id, "athletes"]) ?? [];

      const tempId = Math.random() * 1000000;

      const newAthlete = {
        id: tempId,
        user_id,
        name,
        order: lastOrder + 1,
      };

      const newAthletes = [...previousAthletes, newAthlete];

      queryClient.setQueryData(["groups", group_id, "athletes"], newAthletes);

      return {
        rollback: () => {
          queryClient.setQueryData(
            ["groups", group_id, "athletes"],
            previousAthletes,
          );
        },
        athleteToReplace: newAthlete,
      };
    },

    onSuccess: (data, { group_id }, { athleteToReplace }) => {
      const previousAthletes: AthleteFromDB[] =
        queryClient.getQueryData(["groups", group_id, "athletes"]) ?? [];

      const newAthletes = previousAthletes.map((athlete) => {
        if (athlete.id === athleteToReplace.id) {
          return data;
        }

        return athlete;
      });

      queryClient.setQueryData(["groups", group_id, "athletes"], newAthletes);
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
