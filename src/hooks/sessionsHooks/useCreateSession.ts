import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import createNewSession from "~/services/backend/sessions/createNewSession";

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

    onSuccess: (data) => {
      const oldSessions: any[] = queryClient.getQueryData(["sessions"]) ?? [];

      const newSessions = [...oldSessions, data];

      queryClient.setQueryData(["sessions"], newSessions);
    },
  });
};

export default useCreateSession;
