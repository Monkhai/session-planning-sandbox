import { useQuery } from "@tanstack/react-query";
import getAllMediaForDrill from "~/services/backend/drills/media/getAllMediaForDrill";

const useGetDrillMedia = (station_id: number, session_id: string) => {
  return useQuery({
    queryKey: [session_id, station_id, "drillStationMedia"],
    queryFn: async () => await getAllMediaForDrill(station_id),
    staleTime: 60 * 1000 * 10 * 10, // 10 minute
  });
};
export default useGetDrillMedia;
