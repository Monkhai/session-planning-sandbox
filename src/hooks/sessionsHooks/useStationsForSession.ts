import { useQuery } from "@tanstack/react-query";
import getStationsForSession from "~/services/backend/stations/getStationsForSession";

const useStationsForSession = (sessionId: string) => {
  return useQuery({
    queryKey: ["sessions", sessionId, "stations"],
    queryFn: async () => {
      return await getStationsForSession(sessionId);
    },
  });
};

export default useStationsForSession;
