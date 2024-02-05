import { GroupFromDB, GroupType } from "~/utils/types";
import GroupRow from "./GroupRow";
import Loader from "../Loader";

interface Props {
  groups: GroupFromDB[] | undefined;
  areGroupsLoading: boolean;
}

const GroupList = ({ groups, areGroupsLoading }: Props) => {
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

  if (groups) {
    return (
      <div className="flex w-3/4 flex-col pt-4 md:w-1/2">
        {groups.map((group, index) => {
          const lastGroup = groups[groups.length - 1];
          const isLast = (lastGroup && group.id === lastGroup.id) || false;
          return (
            <GroupRow
              key={group.id}
              group={group}
              index={index}
              isLast={isLast}
            />
          );
        })}
      </div>
    );
  }

  return null;
};

export default GroupList;
