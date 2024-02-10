import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import updateGroup from "~/services/backend/groups/updateGroup";
import { queryKeyFactory } from "~/utils/queryFactories";
import { GroupFromDB } from "~/utils/types";

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
      const queryKey = queryKeyFactory.groups();
      const previousGroups: GroupFromDB[] =
        queryClient.getQueryData(queryKey) ?? [];

      const updatedGroups = previousGroups.map((group) => {
        if (group.id === group_id) {
          return { ...group, name };
        }
        return group;
      });

      queryClient.setQueryData(queryKey, updatedGroups);

      return {
        rollback: () => queryClient.setQueryData(queryKey, previousGroups),
        queryKey,
      };
    },

    onSuccess: async (data, { group_id }, { queryKey }) => {
      if (!data) {
        throw new Error("No data returned from updateSession");
      }

      const previousGroups: GroupFromDB[] =
        queryClient.getQueryData(queryKey) ?? [];

      const updatedGroups = previousGroups.map((group) => {
        if (group.id === group_id) {
          return data;
        }
        return group;
      });

      queryClient.setQueryData(queryKey, updatedGroups);
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

export default useUpdateGroup;
