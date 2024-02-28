import { useQuery } from "@tanstack/react-query";
import getAllMediaForDrill from "~/services/backend/drills/media/getAllMediaForDrill";
import { queryKeyFactory } from "~/utils/queryFactories";

type Args = {
  drill_id: number;
  session_id: string;
};

const useGetDrillMedia = ({ drill_id, session_id }: Args) => {
  const queryKey = queryKeyFactory.drillMedia({
    drill_id: drill_id,
    session_id: session_id,
  });

  return useQuery({
    queryKey: queryKey,
    queryFn: async () => await getAllMediaForDrill(drill_id),
    staleTime: 60 * 1000 * 10 * 10, // 10 minute
  });
};
export default useGetDrillMedia;
