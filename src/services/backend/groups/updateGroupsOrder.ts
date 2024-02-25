import { GroupFromDB } from "~/utils/types";
import updateGroup from "./updateGroup";

export default async (groups: GroupFromDB[]) => {
  try {
    const updatedGroups = Promise.all(
      groups.map(async (group, index) => {
        if (group.order !== index + 1) {
          const newGroup = await updateGroup(group.id, group.name, index + 1);

          if (!newGroup) {
            throw new Error("No data returned from groups");
          }

          return newGroup;
        } else {
          return group;
        }
      }),
    );

    return updatedGroups;
  } catch (error) {
    throw error;
  }
};
