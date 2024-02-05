import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import createNewAthlete from "~/services/backend/athletes/createNewAthlete";
import createNewGroupSession from "~/services/backend/sessions/createNewGroupSession";
import getUserId from "~/services/backend/userManagement/getUserId";
import { AthleteFromDB, SessionFromDB } from "~/utils/types";

const useCreateGroupSession = () => {
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
      return await createNewGroupSession(name, lastOrder, group_id);
    },

    onMutate: async ({ lastOrder, name, group_id }) => {
      const user_id = getUserId();

      if (!user_id) {
        throw new Error("User not logged in");
      }

      queryClient.cancelQueries({ queryKey: ["groups", group_id, "sessions"] });

      const previousSessions: SessionFromDB[] =
        queryClient.getQueryData(["groups", group_id, "sessions"]) ?? [];

      const tempId = Math.random() * 1000000;

      const newSession = {
        id: tempId,
        user_id,
        name,
        order: lastOrder + 1,
      };

      const newSessions = [...previousSessions, newSession];

      queryClient.setQueryData(["groups", group_id, "sessions"], newSessions);

      return {
        rollback: () => {
          queryClient.setQueryData(
            ["groups", group_id, "sessions"],
            previousSessions,
          );
        },
        sessionToReplace: newSession,
      };
    },

    onSuccess: (data, { group_id }, { sessionToReplace }) => {
      const previousSessions: AthleteFromDB[] =
        queryClient.getQueryData(["groups", group_id, "sessions"]) ?? [];

      const newSessions = previousSessions.map((session) => {
        if (session.id === sessionToReplace.id) {
          return data;
        }

        return session;
      });

      queryClient.setQueryData(["groups", group_id, "sessions"], newSessions);
    },

    onError: (error, _, context) => {
      if (context) {
        context.rollback();
      }

      console.error(error);
    },
  });
};

export default useCreateGroupSession;
