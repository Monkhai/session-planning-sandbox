import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import updateSession from "~/services/backend/sessions/updateSession";
import { queryKeyFactory } from "~/utils/queryFactories";
import { SessionWithOrder } from "~/utils/types";

const useUpdateGroupSession = () => {
  return useMutation({
    mutationFn: async ({
      session_id,
      name,
      order,
    }: {
      session_id: number;
      name: string;
      group_id: string;
      order: number;
    }) => {
      return await updateSession({
        joinTable: "sessions_of_groups",
        session_id,
        name,
        order,
      });
    },

    onMutate: async ({ session_id, name, group_id }) => {
      const queryKey = queryKeyFactory.groupSessions({ group_id });
      const previousSessions: SessionWithOrder[] =
        queryClient.getQueryData(queryKey) ?? [];

      const updatedSessions = previousSessions.map((session) => {
        if (session.id === session_id) {
          return { ...session, name };
        }
        return session;
      });

      queryClient.setQueryData(queryKey, updatedSessions);

      return {
        rollback: () => queryClient.setQueryData(queryKey, previousSessions),
        queryKey,
      };
    },

    onSuccess: async (data, { session_id }, { queryKey }) => {
      if (!data) {
        throw new Error("No data returned from updateSession");
      }

      const previousSessions: SessionWithOrder[] =
        queryClient.getQueryData(queryKey) ?? [];

      const updatedSessions = previousSessions.map((session) => {
        if (session.id === session_id) {
          return data;
        }
        return session;
      });

      queryClient.setQueryData(queryKey, updatedSessions);
    },

    onError: (error, _, context) => {
      console.error(error);
      if (context) {
        context.rollback();
      }
      return error;
    },
  });
};

export default useUpdateGroupSession;
