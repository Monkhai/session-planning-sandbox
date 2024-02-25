import { Reorder } from "framer-motion";
import useUpdateGroupOrder from "~/hooks/groupsHooks/useUpdateGroupsOrder";
import { GroupFromDB } from "~/utils/types";
import Loader from "../Loader";
import GroupRow from "./GroupRow";
import React, { useEffect } from "react";

interface Props {
  groups: GroupFromDB[] | undefined;
  areGroupsLoading: boolean;
}

const GroupList = ({ groups, areGroupsLoading }: Props) => {
  const [mutableGroups, setMutableGroups] = React.useState<GroupFromDB[]>(
    groups || [],
  );

  useEffect(() => {
    setMutableGroups(groups || []);
  }, [groups]);

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
    setMutableGroups(newGroups);
  };

  const onReorderEnd = () => {
    updateGroupsOrder({ groups: mutableGroups });
  };

  if (groups) {
    return (
      <Reorder.Group
        values={mutableGroups}
        axis="y"
        onReorder={(newGroups) => handleReorder(newGroups)}
        className="flex w-3/4 flex-col pt-4 md:w-1/2"
        id="group-list"
      >
        {mutableGroups.map((group, index) => {
          const lastGroup = groups[groups.length - 1];
          const isLast = (lastGroup && group.id === lastGroup.id) || false;
          return (
            <GroupRow
              handleReorderEnd={onReorderEnd}
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
