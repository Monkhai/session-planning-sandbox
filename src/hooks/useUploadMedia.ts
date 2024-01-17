import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import { set } from "zod";
import {
  getMediaUrlsForStation,
  uploadDrillStationMedia,
} from "~/services/supabaseFunctions";
import { SignedUrls, UploadMediaArgs } from "~/utils/types";

const useUploadMedia = () => {
  return useMutation({
    mutationFn: async ({ station_id, file }: UploadMediaArgs) => {
      await uploadDrillStationMedia(station_id, file);
      return await getMediaUrlsForStation(station_id);
    },

    onSuccess: (newMedia, { station_id }) => {
      const oldMedia = queryClient.getQueryData([
        "drillStationMedia",
        station_id,
      ]) as SignedUrls[] | undefined;

      if (!oldMedia) {
        queryClient.setQueryData(["drillStationMedia", station_id], newMedia);
        return;
      }

      const uniqueMedia = newMedia.find((media) => !oldMedia.includes(media));

      if (!uniqueMedia) {
        return;
      }

      const updatedMedia = [...oldMedia, uniqueMedia];

      queryClient.setQueryData(["drillStationMedia", station_id], updatedMedia);
    },

    onError: (error) => {
      return error;
    },
  });
};

export default useUploadMedia;
