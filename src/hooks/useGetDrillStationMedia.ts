import { useQuery } from "@tanstack/react-query";
import { getMediaUrlsForStation } from "~/services/supabaseFunctions";

const useGetDrillStationMedia = (station_id: number) => {
  return useQuery({
    queryKey: ["drillStationMedia", station_id],
    queryFn: async () => await getMediaUrlsForStation(station_id),
    staleTime: 60 * 1000 * 10, // 1 minute
  });
};
export default useGetDrillStationMedia;
