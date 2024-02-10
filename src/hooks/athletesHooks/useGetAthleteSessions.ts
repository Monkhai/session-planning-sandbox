import { useQuery } from "@tanstack/react-query";
import getListOfAthleteSessions from "~/services/backend/sessions/getListOfAthleteSessions";
import { queryKeyFactory } from "~/utils/queryFactories";

const useGetAthleteSessions = ({
  athlete_id,
  group_id,
}: {
  athlete_id: string;
  group_id: string;
}) => {
  const queryKey = queryKeyFactory.athleteSessions({ athlete_id, group_id });
  return useQuery({
    queryKey: queryKey,
    queryFn: async () => await getListOfAthleteSessions(Number(athlete_id)),
  });
};

export default useGetAthleteSessions;
