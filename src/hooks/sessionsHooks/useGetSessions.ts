import { useQuery } from "@tanstack/react-query";
import getAllSessions from "~/services/backend/sessions/getAllSessions";

const useGetSessions = () => {
  return useQuery({
    queryKey: ["sessions"],
    queryFn: async () => await getAllSessions(),
  });
};

export default useGetSessions;
