import { useQuery } from "@tanstack/react-query";
import getListOfGroupAthletes from "~/services/backend/athletes/getListOfGroupAthletes";
import { queryKeyFactory } from "~/utils/queryFactories";

const useGetGroupAthletes = (group_id: string) => {
  const queryKey = queryKeyFactory.groupAthletes({ group_id });
  return useQuery({
    queryKey: queryKey,
    queryFn: async () => await getListOfGroupAthletes(Number(group_id)),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export default useGetGroupAthletes;
