import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import UpdateAthletesOrder from "~/services/backend/athletes/UpdateAthletesOrder";
import { queryKeyFactory } from "~/utils/queryFactories";
import { AthleteWithOrder } from "~/utils/types";

const useUpdateAthletesOrder = () => {
  return useMutation({
    mutationFn: async ({
      athletes,
    }: {
      athletes: AthleteWithOrder[];
      group_id: string;
    }) => {
      return await UpdateAthletesOrder(athletes);
    },

    onMutate: async ({ athletes, group_id }) => {
      const queryKey = queryKeyFactory.groupAthletes({ group_id });

      const previousAthletes: AthleteWithOrder[] =
        queryClient.getQueryData(queryKey) ?? [];

      const orderedAthletes = athletes.map((athlete, index) => {
        return { ...athlete, order: index + 1 };
      });
      queryClient.setQueryData(queryKey, orderedAthletes);

      return {
        rollback: () => queryClient.setQueryData(queryKey, previousAthletes),
        queryKey,
      };
    },

    onSuccess: async (data, _, { queryKey }) => {
      if (!data) {
        throw new Error("No data returned from updateAthletesOrder");
      }

      queryClient.setQueryData(queryKey, data);
    },

    onError: (error, _, context) => {
      console.error(error);
      if (context) context.rollback();
    },
  });
};

export default useUpdateAthletesOrder;
