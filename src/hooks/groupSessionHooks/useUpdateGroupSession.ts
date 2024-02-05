import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import updateSession from "~/services/backend/sessions/updateSession";
import { SessionFromDB } from "~/utils/types";

const useUpdateGroupSession = () => {
  return useMutation({
    mutationFn: async ({
      session_id,
      name,
    }: {
      session_id: number;
      name: string;
      group_id: number;
    }) => {
      return await updateSession(session_id, name);
    },

    onMutate: async ({ session_id, name, group_id }) => {
      const previousSessions: SessionFromDB[] =
        queryClient.getQueryData(["groups", group_id, "sessions"]) ?? [];

      const updatedSessions = previousSessions.map((session) => {
        if (session.id === session_id) {
          return { ...session, name };
        }
        return session;
      });

      queryClient.setQueryData(
        ["groups", group_id, "sessions"],
        updatedSessions,
      );

      return () =>
        queryClient.setQueryData(
          ["groups", group_id, "sessions"],
          previousSessions,
        );
    },

    onSuccess: async (data, { session_id, group_id }) => {
      if (!data) {
        throw new Error("No data returned from updateSession");
      }

      const previousSessions: SessionFromDB[] =
        queryClient.getQueryData(["groups", group_id, "sessions"]) ?? [];

      const updatedSessions = previousSessions.map((session) => {
        if (session.id === session_id) {
          return data;
        }
        return session;
      });

      queryClient.setQueryData(
        ["groups", group_id, "sessions"],
        updatedSessions,
      );
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

export default useUpdateGroupSession;
