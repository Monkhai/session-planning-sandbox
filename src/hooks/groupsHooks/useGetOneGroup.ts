import { useQuery } from "@tanstack/react-query";
import getOneGroup from "~/services/backend/groups/getOneGroup";
import { queryKeyFactory } from "~/utils/queryFactories";

const useGetOneGroup = (group_id: string) => {
  const queryKey = queryKeyFactory.specificGroup({ group_id });
  return useQuery({
    queryKey: queryKey,
    queryFn: async () => await getOneGroup(Number(group_id)),
  });
};

export default useGetOneGroup;
