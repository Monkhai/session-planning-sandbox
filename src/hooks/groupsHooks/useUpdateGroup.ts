import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import updateGroup from "~/services/backend/groups/updateGroup";
import updateSession from "~/services/backend/sessions/updateSession";
import { GroupFromDB, SessionFromDB } from "~/utils/types";

const useUpdateGroup = () => {
  return useMutation({
    mutationFn: async ({
      group_id,
      name,
    }: {
      group_id: number;
      name: string;
    }) => {
      return await updateGroup(group_id, name);
    },

    onMutate: async ({ group_id, name }) => {
      const previousGroups: GroupFromDB[] =
        queryClient.getQueryData(["groups"]) ?? [];

      const updatedGroups = previousGroups.map((group) => {
        if (group.id === group_id) {
          return { ...group, name };
        }
        return group;
      });

      queryClient.setQueryData(["groups"], updatedGroups);

      return () => queryClient.setQueryData(["groups"], previousGroups);
    },

    onSuccess: async (data, { group_id }) => {
      if (!data) {
        throw new Error("No data returned from updateSession");
      }

      const previousGroups: GroupFromDB[] =
        queryClient.getQueryData(["groups"]) ?? [];

      const updatedGroups = previousGroups.map((group) => {
        if (group.id === group_id) {
          return data;
        }
        return group;
      });

      queryClient.setQueryData(["groups"], updatedGroups);
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

export default useUpdateGroup;
