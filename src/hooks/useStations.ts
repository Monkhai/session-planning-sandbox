import { useQuery } from "@tanstack/react-query";
import { getAllStations } from "~/services/supabaseFunctions";

const useStations = () => {
  return useQuery({
    queryKey: ["stations"],
    queryFn: async () => {
      return await getAllStations();
    },
    staleTime: 1000 * 60 * 60 * 24,
  });
};

export default useStations;
