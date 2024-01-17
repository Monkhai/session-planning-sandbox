import { useQuery } from "@tanstack/react-query";
import { getMediaUrlsForStation } from "~/services/supabaseFunctions";

const useGetDrillStationMedia = (station_id: number) => {
  return useQuery({
    queryKey: ["drillStationMedia", station_id],
    queryFn: async () => await getMediaUrlsForStation(station_id),
  });
};
export default useGetDrillStationMedia;
