import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import { set } from "zod";
import uploadDrillMedia from "~/services/backend/drills/media/uploadDrillMedia";
import getDrillStations from "~/services/backend/stations/drillStations/getDrillStations";
import { SignedUrls, UploadMediaArgs } from "~/utils/types";
import useGetDrillMedia from "./useGetDrillStationMedia";
import getAllMediaForDrill from "~/services/backend/drills/media/getAllMediaForDrill";

const useUploadMedia = () => {
  return useMutation({
    mutationFn: async ({ station_id, file }: UploadMediaArgs) => {
      await uploadDrillMedia(station_id, file);
      return await getAllMediaForDrill(station_id);
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
      const previousMedia = queryClient.getQueryData([
        "drillStationMedia",
        station_id,
      ]) as SignedUrls[] | undefined;

      const mediaToReplace = newMedia.find(
        (media) =>
          !previousMedia?.find((oldMedia) => oldMedia.name === media.name),
      );

      const filteredMedia = previousMedia?.filter(
        (media) => media.name !== "loader-image",
      );

      const updatedMedia = filteredMedia
        ? [...filteredMedia, mediaToReplace]
        : [mediaToReplace];

      queryClient.setQueryData(["drillStationMedia", station_id], updatedMedia);
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
