import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import updateGroupsOrder from "~/services/backend/groups/updateGroupsOrder";
import { queryKeyFactory } from "~/utils/queryFactories";
import { GroupFromDB } from "~/utils/types";

const useUpdateGroupOrder = () => {
  return useMutation({
    mutationFn: async ({ groups }: { groups: GroupFromDB[] }) => {
      return await updateGroupsOrder(groups);
    },

    onMutate: async ({ groups }) => {
      const queryKey = queryKeyFactory.groups();

      const previousGroups: GroupFromDB[] =
        queryClient.getQueryData(queryKey) ?? [];

      queryClient.setQueryData(queryKey, groups);

      return {
        rollback: () => queryClient.setQueryData(queryKey, previousGroups),
        queryKey,
      };
    },

    onSuccess: async (data, _, { queryKey }) => {
      if (!data) {
        throw new Error("No data returned from updateGroupsOrder");
      }

      queryClient.setQueryData(queryKey, data);
    },

    onError: (error, _, context) => {
      console.error(error);
      if (context) context.rollback();
    },
  });
};

export default useUpdateGroupOrder;
