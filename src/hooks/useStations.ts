import { useQuery } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import { getAllStations } from "~/services/supabaseFunctions";

const useStations = () => {
  return useQuery({
    queryKey: ["stations"],
    queryFn: async () => {
      console.log(queryClient.getQueryData(["stations"]));
      return await getAllStations();
    },
    staleTime: 1000 * 60, // 1 minute
  });
};

export default useStations;
