import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import decrementSessionOrder from "~/services/backend/sessions/decrementSessionOrder";
import deleteSession from "~/services/backend/sessions/deleteSession";
import { SessionFromDB } from "~/utils/types";

const useDeleteGroupSession = () => {
  return useMutation({
    mutationFn: async ({
      session_id,
    }: {
      session_id: number;
      group_id: number;
    }) => {
      await deleteSession(session_id);
    },

    onMutate: async ({ group_id, session_id }) => {
      queryClient.cancelQueries({ queryKey: ["groups", group_id, "sessions"] });

      const previousSessions: SessionFromDB[] =
        queryClient.getQueryData(["groups", group_id, "sessions"]) ?? [];

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

      queryClient.setQueryData(
        ["groups", group_id, "sessions"],
        newSessionsWithUpdatedOrder,
      );

      return {
        rollback: () =>
          queryClient.setQueryData(
            ["groups", group_id, "sessions"],
            previousSessions,
          ),
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
