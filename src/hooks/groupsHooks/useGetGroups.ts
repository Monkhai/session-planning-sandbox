import { useQuery } from "@tanstack/react-query";
import getAllGroups from "~/services/backend/groups/getAllGroups";
import getAllSessions from "~/services/backend/sessions/getAllSessions";
import { queryKeyFactory } from "~/utils/queryFactories";
import { GroupFromDB, SessionFromDB } from "~/utils/types";

const useGetGroups = () => {
  const queryKey = queryKeyFactory.groups();
  return useQuery({
    queryKey: queryKey,
    queryFn: async () => await getAllGroups<GroupFromDB>(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export default useGetGroups;
