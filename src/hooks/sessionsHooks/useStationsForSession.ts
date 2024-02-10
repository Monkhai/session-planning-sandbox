import { useQuery } from "@tanstack/react-query";
import getStationsForSession from "~/services/backend/stations/getStationsForSession";
import { queryKeyFactory } from "~/utils/queryFactories";

interface Args {
  session_id: string;
}

const useStationsForSession = ({ session_id }: Args) => {
  const queryKey = queryKeyFactory.stations({ session_id });
  return useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      return await getStationsForSession(session_id);
    },
  });
};

export default useStationsForSession;
