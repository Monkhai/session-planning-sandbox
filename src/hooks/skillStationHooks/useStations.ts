import { useQuery } from "@tanstack/react-query";
import getAllStations from "~/services/backend/stations/getAllStations";

const useStations = () => {
  return useQuery({
    queryKey: ["stations"],
    queryFn: async () => {
      return await getAllStations();
    },
    staleTime: 1000 * 60 * 10, // 10 minute
  });
};

export default useStations;
