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
      console.log(file.name);
      await uploadDrillStationMedia(station_id, file);
      return await getMediaUrlsForStation(station_id);
    },

    onMutate: async ({ station_id, file }) => {
      const previousMedia = queryClient.getQueryData([
        "drillStationMedia",
        station_id,
      ]) as SignedUrls[] | undefined;

      const tempMediaPlacehoder = {
        dimensions: { width: 0, height: 0 },
        name: "loader-image",
        type: "loader",
        url: "",
      } as SignedUrls;

      const newMedia = previousMedia
        ? [...previousMedia, tempMediaPlacehoder]
        : [tempMediaPlacehoder];

      queryClient.setQueryData(["drillStationMedia", station_id], newMedia);

      return () => {
        queryClient.setQueryData(
          ["drillStationMedia", station_id],
          previousMedia,
        );
      };
    },

    onSuccess: (newMedia, { station_id }) => {
      queryClient.setQueryData(["drillStationMedia", station_id], newMedia);
    },

    onError: (error, _, callback) => {
      console.error(error);
      if (callback) {
        callback();
      }
    },
  });
};

export default useUploadMedia;
