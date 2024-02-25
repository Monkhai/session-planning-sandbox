import { useQuery } from "@tanstack/react-query";
import getAllGroups from "~/services/backend/groups/getAllGroups";
import { queryKeyFactory } from "~/utils/queryFactories";
import { GroupFromDB } from "~/utils/types";

const useGetGroups = () => {
  const queryKey = queryKeyFactory.groups();
  return useQuery({
    queryKey: queryKey,
    queryFn: async () => await getAllGroups<GroupFromDB>(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export default useGetGroups;
