import { useQuery } from "@tanstack/react-query";
import getOneAthlete from "~/services/backend/athletes/getOneAthlete";
import { queryKeyFactory } from "~/utils/queryFactories";

interface Args {
  athlete_id: string;
  group_id: string;
}

export default ({ athlete_id, group_id }: Args) => {
  const queryKey = queryKeyFactory.specificAthlete({ group_id, athlete_id });
  return useQuery({
    queryKey: queryKey,
    queryFn: async () => await getOneAthlete(Number(athlete_id)),
  });
};
