import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import createNewGroup from "~/services/backend/groups/createNewGroup";
import getUserId from "~/services/backend/userManagement/getUserId";
import { queryKeyFactory } from "~/utils/queryFactories";
import { GroupFromDB } from "~/utils/types";

const useCreateGroup = () => {
  return useMutation({
    mutationFn: async ({
      lastOrder,
      name,
    }: {
      name: string;
      lastOrder: number;
    }) => {
      return await createNewGroup(name, lastOrder);
    },

    onMutate: async ({ lastOrder, name }) => {
      const queryKey = queryKeyFactory.groups();
      const user_id = getUserId();

      if (!user_id) {
        throw new Error("User not logged in");
      }

      queryClient.cancelQueries({ queryKey: queryKey });

      const previousGroups: GroupFromDB[] =
        queryClient.getQueryData(queryKey) ?? [];

      const tempId = Math.random() * 1000000;

      const newGroup = {
        id: tempId,
        user_id,
        name,
        order: lastOrder + 1,
      };

      const newGroups = [...previousGroups, newGroup];

      queryClient.setQueryData(queryKey, newGroups);

      return {
        rollback: () => {
          queryClient.setQueryData(queryKey, previousGroups);
        },
        groupToReplace: newGroup,
        queryKey,
      };
    },

    onSuccess: (data, _, { groupToReplace, queryKey }) => {
      const previousGroups: GroupFromDB[] =
        queryClient.getQueryData(queryKey) ?? [];

      const newGroups = previousGroups.map((group) => {
        if (group.id === groupToReplace.id) {
          return data;
        }

        return group;
      });

      queryClient.setQueryData(queryKey, newGroups);
    },

    onError: (error, _, context) => {
      if (context) {
        context.rollback();
      }

      console.error(error);
    },
  });
};

export default useCreateGroup;
