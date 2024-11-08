import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import updateGroupSessionOrder from "~/services/backend/sessions/updateGroupSessionOrder";
import { queryKeyFactory } from "~/utils/queryFactories";
import { SessionWithOrder } from "~/utils/types";

const useUpdateGroupSessionOrder = () => {
  return useMutation({
    mutationFn: async ({
      sessions,
    }: {
      sessions: SessionWithOrder[];
      group_id: string;
    }) => {
      return await updateGroupSessionOrder(sessions);
    },

    onMutate: async ({ sessions, group_id }) => {
      const queryKey = queryKeyFactory.groupSessions({ group_id });

      const previousAthletes: SessionWithOrder[] =
        queryClient.getQueryData(queryKey) ?? [];

      const orderedSessions = sessions.map((session, index) => {
        return { ...session, order: index + 1 };
      });

      queryClient.setQueryData(queryKey, orderedSessions);

      return {
        rollback: () => queryClient.setQueryData(queryKey, previousAthletes),
        queryKey,
      };
    },

    onSuccess: async (data, _, { queryKey }) => {
      if (!data) {
        throw new Error("No data returned from updateGroupSessionOrder");
      }

      queryClient.setQueryData(queryKey, data);
    },

    onError: (error, _, context) => {
      console.error(error);
      if (context) context.rollback();
    },
  });
};

export default useUpdateGroupSessionOrder;
