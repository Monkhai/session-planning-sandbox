import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import createNewGroup from "~/services/backend/groups/createNewGroup";
import getUserId from "~/services/backend/userManagement/getUserId";
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
      const user_id = getUserId();

      if (!user_id) {
        throw new Error("User not logged in");
      }

      queryClient.cancelQueries({ queryKey: ["groups"] });

      const previousGroups: GroupFromDB[] =
        queryClient.getQueryData(["groups"]) ?? [];

      const tempId = Math.random() * 1000000;

      const newGroup = {
        id: tempId,
        user_id,
        name,
        order: lastOrder + 1,
      };

      const newGroups = [...previousGroups, newGroup];

      queryClient.setQueryData(["groups"], newGroups);

      return {
        rollback: () => {
          queryClient.setQueryData(["groups"], previousGroups);
        },
        groupToReplace: newGroup,
      };
    },

    onSuccess: (data, _, { groupToReplace }) => {
      const previousGroups: GroupFromDB[] =
        queryClient.getQueryData(["groups"]) ?? [];

      const newGroups = previousGroups.map((group) => {
        if (group.id === groupToReplace.id) {
          return data;
        }

        return group;
      });

      queryClient.setQueryData(["groups"], newGroups);
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
