import { useQuery } from "@tanstack/react-query";
import getAllSessions from "~/services/backend/sessions/getAllSessions";
import { SessionFromDB } from "~/utils/types";

const useGetSessions = () => {
  return useQuery({
    queryKey: ["sessions"],
    queryFn: async () => await getAllSessions<SessionFromDB>(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export default useGetSessions;
