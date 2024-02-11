import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import getAllMediaForDrill from "~/services/backend/drills/media/getAllMediaForDrill";
import uploadDrillMedia from "~/services/backend/drills/media/uploadDrillMedia";
import { queryKeyFactory } from "~/utils/queryFactories";
import { SignedUrls, UploadMediaArgs } from "~/utils/types";
type Args = {
  station_id: number;
  session_id: string;
  file: File;
};
const useUploadMedia = () => {
  return useMutation({
    mutationFn: async ({ station_id, file }: Args) => {
      await uploadDrillMedia(station_id, file);
      return await getAllMediaForDrill(station_id);
    },

    onMutate: async ({ station_id, session_id }) => {
      const queryKey = queryKeyFactory.drillMedia({
        session_id,
        drill_id: station_id,
      });
      const previousMedia = queryClient.getQueryData(queryKey) as
        | SignedUrls[]
        | undefined;

      const tempMediaPlacehoder = {
        dimensions: { width: 0, height: 0 },
        name: "loader-image",
        type: "loader",
        url: "",
      } as SignedUrls;

      const newMedia = previousMedia
        ? [...previousMedia, tempMediaPlacehoder]
        : [tempMediaPlacehoder];

      queryClient.setQueryData(queryKey, newMedia);
      return {
        callback: () => {
          queryClient.setQueryData(queryKey, previousMedia);
        },
        queryKey,
      };
    },

    onSuccess: (newMedia, { station_id, session_id }, { queryKey }) => {
      const previousMedia = queryClient.getQueryData(queryKey) as
        | SignedUrls[]
        | undefined;

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

      queryClient.setQueryData(queryKey, updatedMedia);
    },

    onError: (error, _, context) => {
      console.error(error);
      alert("Error uploading media");
      if (context) {
        context.callback();
      }
    },
  });
};

export default useUploadMedia;
