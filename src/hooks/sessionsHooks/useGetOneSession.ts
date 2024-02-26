import { useQuery } from "@tanstack/react-query";
import getOneGroup from "~/services/backend/groups/getOneGroup";
import getOneSession from "~/services/backend/sessions/getOneSession";
import { queryKeyFactory } from "~/utils/queryFactories";

const useGetOneSession = (session_id: string) => {
  const queryKey = queryKeyFactory.specificSession({ session_id });
  return useQuery({
    queryKey: queryKey,
    queryFn: async () => await getOneSession(Number(session_id)),
  });
};

export default useGetOneSession;
