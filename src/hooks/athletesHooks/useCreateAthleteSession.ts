import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import createNewAthleteSession from "~/services/backend/sessions/createNewAthleteSession";
import getUserId from "~/services/backend/userManagement/getUserId";
import { queryKeyFactory } from "~/utils/queryFactories";
import { AthleteFromDB, SessionWithOrder } from "~/utils/types";

const useCreateAthleteSession = () => {
  return useMutation({
    mutationFn: async ({
      lastOrder,
      name,
      athlete_id,
    }: {
      name: string;
      lastOrder: number;
      group_id: string;
      athlete_id: string;
    }) => {
      return await createNewAthleteSession(name, lastOrder, Number(athlete_id));
    },

    onMutate: async ({ lastOrder, name, group_id, athlete_id }) => {
      const queryKey = queryKeyFactory.athleteSessions({
        group_id,
        athlete_id,
      });
      const user_id = getUserId();

      if (!user_id) {
        throw new Error("User not logged in");
      }

      queryClient.cancelQueries({
        queryKey: queryKey,
      });

      const previousSessions: SessionWithOrder[] =
        queryClient.getQueryData(queryKey) ?? [];

      const tempId = Math.random() * 1000000;

      const newSession = {
        id: tempId,
        user_id,
        name,
        order: lastOrder + 1,
      };

      const newSessions = [...previousSessions, newSession];

      queryClient.setQueryData(queryKey, newSessions);

      return {
        rollback: () => {
          queryClient.setQueryData(queryKey, previousSessions);
        },
        sessionToReplace: newSession,
        queryKey,
      };
    },

    onSuccess: (data, __, { sessionToReplace, queryKey }) => {
      const previousSessions: AthleteFromDB[] =
        queryClient.getQueryData(queryKey) ?? [];

      const newSessions = previousSessions.map((session) => {
        if (session.id === sessionToReplace.id) {
          return data;
        }

        return session;
      });

      queryClient.setQueryData(queryKey, newSessions);
    },

    onError: (error, _, context) => {
      if (context) {
        context.rollback();
      }

      console.error(error);
    },
  });
};

export default useCreateAthleteSession;
