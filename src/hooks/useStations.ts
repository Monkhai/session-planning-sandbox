import { useQuery } from "@tanstack/react-query";
import { getStations } from "~/services/supabaseFunctions";

const useStations = () => {
  return useQuery({
    queryKey: ["stations"],
    queryFn: getStations,
    staleTime: 1000 * 60 * 60 * 24,
  });
};

export default useStations;
