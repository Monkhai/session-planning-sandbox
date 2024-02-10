import { useQuery } from "@tanstack/react-query";
import getListOfGroupSessions from "~/services/backend/sessions/getListOfGroupSessions";
import { queryKeyFactory } from "~/utils/queryFactories";

interface Args {
  group_id: string;
}

const useGetGroupSessions = ({ group_id }: Args) => {
  const queryKey = queryKeyFactory.groupSessions({ group_id });
  return useQuery({
    queryKey: queryKey,
    queryFn: async () => await getListOfGroupSessions(Number(group_id)),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export default useGetGroupSessions;
