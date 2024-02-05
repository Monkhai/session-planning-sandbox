import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import decrementGroupOrder from "~/services/backend/groups/decrementGroupOrder";
import deleteGroup from "~/services/backend/groups/deleteGroup";
import { GroupFromDB } from "~/utils/types";

const useDeleteGroup = () => {
  return useMutation({
    mutationFn: async (group_id: number) => {
      await deleteGroup(group_id);
    },

    onMutate: async (group_id: number) => {
      queryClient.cancelQueries({ queryKey: ["groups"] });

      const previousGroups: GroupFromDB[] =
        queryClient.getQueryData(["groups"]) ?? [];

      const index = previousGroups.findIndex(
        (group: GroupFromDB) => group.id === group_id,
      );

      const newGroups = previousGroups.filter(
        (group: GroupFromDB) => group.id !== group_id,
      );

      const groupsToUpdate = newGroups.slice(index);

      const newGroupsWithUpdatedOrder = newGroups.map((group) => {
        if (group.order > index) {
          return { ...group, order: group.order - 1 };
        }
        return group;
      });

      queryClient.setQueryData(["groups"], newGroupsWithUpdatedOrder);

      return {
        rollback: () => queryClient.setQueryData(["groups"], previousGroups),
        groupsToUpdate,
      };
    },

    onSuccess: async (_, __, { rollback, groupsToUpdate }) => {
      try {
        for (const group of groupsToUpdate) {
          await decrementGroupOrder(group);
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

export default useDeleteGroup;
