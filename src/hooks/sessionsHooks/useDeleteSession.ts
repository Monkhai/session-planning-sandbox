import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import decrementSessionOrder from "~/services/backend/sessions/decrementSessionOrder";
import deleteSession from "~/services/backend/sessions/deleteSession";
import { SessionFromDB } from "~/utils/types";

const useDeleteSession = () => {
  return useMutation({
    mutationFn: async (session_id: number) => {
      await deleteSession(session_id);
    },

    onMutate: async (session_id: number) => {
      queryClient.cancelQueries({ queryKey: ["sessions"] });

      const previousSessions: SessionFromDB[] =
        queryClient.getQueryData(["sessions"]) ?? [];

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

      queryClient.setQueryData(["sessions"], newSessionsWithUpdatedOrder);

      return {
        rollback: () =>
          queryClient.setQueryData(["sessions"], previousSessions),
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

export default useDeleteSession;
