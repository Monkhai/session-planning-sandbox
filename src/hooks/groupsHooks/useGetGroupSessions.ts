import { useQuery } from "@tanstack/react-query";
import getListOfGroupSessions from "~/services/backend/sessions/getListOfGroupSessions";

const useGetGroupSessions = (group_id: number) => {
  return useQuery({
    queryKey: ["groups", group_id, "sessions"],
    queryFn: async () => await getListOfGroupSessions(group_id),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export default useGetGroupSessions;
