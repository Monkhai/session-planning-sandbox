import { useQuery } from "@tanstack/react-query";
import getAllMediaForDrill from "~/services/backend/drills/media/getAllMediaForDrill";

const useGetDrillMedia = (station_id: number) => {
  return useQuery({
    queryKey: ["drillStationMedia", station_id],
    queryFn: async () => await getAllMediaForDrill(station_id),
    staleTime: 60 * 1000 * 10 * 10, // 10 minute
  });
};
export default useGetDrillMedia;
