import { useQuery } from "@tanstack/react-query";
import { getAllStations } from "~/services/supabaseFunctions";

const useStations = () => {
  return useQuery({
    queryKey: ["stations"],
    queryFn: async () => {
      return await getAllStations();
    },
    staleTime: 1000 * 60, // 1 minute
  });
};

export default useStations;
