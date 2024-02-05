import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import updateAthlete from "~/services/backend/athletes/updateAthlete";
import updateGroup from "~/services/backend/groups/updateGroup";
import { AthleteFromDB, GroupFromDB } from "~/utils/types";

const useUpdateAthlete = () => {
  return useMutation({
    mutationFn: async ({
      athlete_id,
      name,
    }: {
      group_id: number;
      athlete_id: number;
      name: string;
    }) => {
      return await updateAthlete(athlete_id, name);
    },

    onMutate: async ({ athlete_id, name, group_id }) => {
      const previousAthletes: AthleteFromDB[] =
        queryClient.getQueryData(["groups", group_id, "athletes"]) ?? [];

      const updatedGroups = previousAthletes.map((athlete) => {
        if (athlete.id === athlete_id) {
          return { ...athlete, name };
        }
        return athlete;
      });

      queryClient.setQueryData(["groups", group_id, "athletes"], updatedGroups);

      return () =>
        queryClient.setQueryData(
          ["groups", group_id, "athletes"],
          previousAthletes,
        );
    },

    onSuccess: async (data, { athlete_id, group_id }) => {
      if (!data) {
        throw new Error("No data returned from updateSession");
      }

      const previousGroups: AthleteFromDB[] =
        queryClient.getQueryData(["groups", group_id, "athletes"]) ?? [];

      const updatedGroups = previousGroups.map((group) => {
        if (group.id === athlete_id) {
          return data;
        }
        return group;
      });

      queryClient.setQueryData(["groups", group_id, "athletes"], updatedGroups);
    },

    onError: (error, _, rollback) => {
      console.error(error);
      if (rollback) {
        rollback();
      }
      return error;
    },
  });
};

export default useUpdateAthlete;
