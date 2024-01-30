import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import createNewSession from "~/services/backend/sessions/createNewSession";
import getUserId from "~/services/backend/userManagement/getUserId";
import { SessionFromDB } from "~/utils/types";

const useCreateSession = () => {
  return useMutation({
    mutationFn: async ({
      lastOrder,
      name,
    }: {
      name: string;
      lastOrder: number;
    }) => {
      return await createNewSession(name, lastOrder);
    },

    onMutate: async ({ lastOrder, name }) => {
      const user_id = getUserId();

      if (!user_id) {
        throw new Error("User not logged in");
      }

      queryClient.cancelQueries({ queryKey: ["sessions"] });

      const previousSessions: any[] =
        queryClient.getQueryData(["sessions"]) ?? [];

      const tempId = Math.random() * 1000000;

      const newSession = {
        id: tempId,
        user_id,
        name,
        order: lastOrder + 1,
      };

      const newSessions = [...previousSessions, newSession];

      queryClient.setQueryData(["sessions"], newSessions);

      return {
        rollback: () => {
          queryClient.setQueryData(["sessions"], previousSessions);
        },
        sessionToReplace: newSession,
      };
    },

    onSuccess: (data, _, { sessionToReplace }) => {
      const oldSessions: SessionFromDB[] =
        queryClient.getQueryData(["sessions"]) ?? [];

      const newSessions = oldSessions.map((session) => {
        if (session.id === sessionToReplace.id) {
          return data;
        }

        return session;
      });

      queryClient.setQueryData(["sessions"], newSessions);
    },

    onError: (error, _, context) => {
      if (context) {
        context.rollback();
      }

      console.error(error);
    },
  });
};

export default useCreateSession;
