import { useQuery } from "@tanstack/react-query";
import { getSkillStations } from "~/services/supabaseFunctions";

const useSkillStations = () => {
  return useQuery({
    queryKey: ["stations"],
    queryFn: getSkillStations,
    staleTime: 1000 * 60 * 60 * 24,
  });
};

export default useSkillStations;
