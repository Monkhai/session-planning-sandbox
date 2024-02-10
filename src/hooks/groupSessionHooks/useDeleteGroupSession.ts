import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import decrementSessionOrder from "~/services/backend/sessions/decrementSessionOrder";
import deleteSession from "~/services/backend/sessions/deleteSession";
import { queryKeyFactory } from "~/utils/queryFactories";
import { SessionFromDB } from "~/utils/types";

const useDeleteGroupSession = () => {
  return useMutation({
    mutationFn: async ({
      session_id,
    }: {
      session_id: number;
      group_id: string;
    }) => {
      await deleteSession(session_id);
    },

    onMutate: async ({ group_id, session_id }) => {
      const queryKey = queryKeyFactory.groupSessions({ group_id });
      queryClient.cancelQueries({
        queryKey: queryKey,
      });

      const previousSessions: SessionFromDB[] =
        queryClient.getQueryData(queryKey) ?? [];

      const index = previousSessions.findIndex(
        (session: SessionFromDB) => session.id === session_id,
      );

      const newSessions = previousSessions.filter(
        (session: SessionFromDB) => session.id !== session_id,
      );

      const sessionsToUpdate = newSessions.slice(index);

      const newSessionsWithUpdatedOrder = newSessions.map((session) => {
        if (session.order > index) {
          return { ...session, order: session.order - 1 };
        }
        return session;
      });

      queryClient.setQueryData(queryKey, newSessionsWithUpdatedOrder);

      return {
        rollback: () => queryClient.setQueryData(queryKey, previousSessions),
        sessionsToUpdate,
      };
    },

    onSuccess: async (_, __, { rollback, sessionsToUpdate }) => {
      try {
        for (const session of sessionsToUpdate) {
          await decrementSessionOrder(session);
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

export default useDeleteGroupSession;
