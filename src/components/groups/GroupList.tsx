import { Reorder } from "framer-motion";
import useUpdateGroupOrder from "~/hooks/groupsHooks/useUpdateGroupsOrder";
import { GroupFromDB } from "~/utils/types";
import Loader from "../Loader";
import GroupRow from "./GroupRow";
import React, { useEffect } from "react";
import { queryKeyFactory } from "~/utils/queryFactories";
import { queryClient } from "Providers/ReactQueryProvider";

interface Props {
  groups: GroupFromDB[] | undefined;
  areGroupsLoading: boolean;
}

const GroupList = ({ groups, areGroupsLoading }: Props) => {
  const { mutate: updateGroupsOrder } = useUpdateGroupOrder();

  if (areGroupsLoading) {
    return (
      <div className="flex h-full w-full flex-1 items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (groups && groups.length === 0) {
    return (
      <div className="flex h-full w-full flex-1 items-center justify-center">
        <h3 className="text-xl font-semibold">Create a New Group to Start!</h3>
      </div>
    );
  }

  const handleReorder = (newGroups: GroupFromDB[]) => {
    const queryKey = queryKeyFactory.groups();
    queryClient.setQueryData(queryKey, newGroups);
  };

  const handleReorderEnd = () => {
    if (groups) {
      updateGroupsOrder({ groups: groups });
    }
  };

  if (groups) {
    return (
      <Reorder.Group
        values={groups}
        axis="y"
        onReorder={(newGroups) => handleReorder(newGroups)}
        className="flex w-3/4 flex-col pt-4 md:w-1/2"
        id="group-list"
      >
        {groups.map((group, index) => {
          const lastGroup = groups[groups.length - 1];
          const isLast = (lastGroup && group.id === lastGroup.id) || false;
          return (
            <GroupRow
              handleReorderEnd={handleReorderEnd}
              key={group.id}
              group={group}
              index={index}
              isLast={isLast}
            />
          );
        })}
      </Reorder.Group>
    );
  }

  return null;
};

export default GroupList;
