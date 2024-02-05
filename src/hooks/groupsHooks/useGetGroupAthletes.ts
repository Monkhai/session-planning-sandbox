import { useQuery } from "@tanstack/react-query";
import getListOfGroupAthletes from "~/services/backend/athletes/getListOfGroupAthletes";

const useGetGroupAthletes = (group_id: number) => {
  return useQuery({
    queryKey: ["groups", group_id, "athletes"],
    queryFn: async () => await getListOfGroupAthletes(group_id),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export default useGetGroupAthletes;
