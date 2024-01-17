import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import {
  getAllStations,
  getOneDrillStation,
  uploadDrillStationMedia,
} from "~/services/supabaseFunctions";
import {
  SignedUrls,
  Station,
  UploadMediaArgs,
  drillStationType,
} from "~/utils/types";

const useUploadMedia = () => {
  return useMutation({
    mutationFn: async ({ station_id, file }: UploadMediaArgs) => {
      await uploadDrillStationMedia(station_id, file);
      return await getOneDrillStation(station_id);
    },

    onSuccess: (newStation) => {
      if (!newStation) return;

      console.log(newStation);

      const previousStations: Station[] =
        queryClient.getQueryData<Station[]>(["stations"]) ?? [];

      const targetStation = previousStations.find(
        (station) =>
          station.id === newStation.id && station.type === "drillStation",
      ) as drillStationType;

      const newMedia = newStation.mediaUrls;

      const oldMedia = targetStation.mediaUrls;

      const newUrl = newMedia.find((url) => !oldMedia.includes(url));

      targetStation.mediaUrls = [...oldMedia, newUrl as SignedUrls];

      const newStations = previousStations.map((station) => {
        if (station.id === newStation.id) {
          return targetStation;
        }
        return station;
      });

      queryClient.setQueryData(["stations"], newStations);
    },

    onError: (error) => {
      return error;
    },
  });
};

export default useUploadMedia;
