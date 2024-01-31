import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import deleteMedia from "~/services/backend/drills/media/deleteMedia";
import { SignedUrls } from "~/utils/types";

const useDeleteMedia = () => {
  return useMutation({
    mutationFn: async ({
      name,
      station_id,
    }: {
      name: string;
      station_id: number;
      session_id: string;
    }) => {
      await deleteMedia(name, station_id);
    },

    onMutate: async ({ name, station_id, session_id }) => {
      const previousMedia = queryClient.getQueryData([
        "drillStationMedia",
        station_id,
      ]) as SignedUrls[] | undefined;

      const newMedia = previousMedia?.filter((media) => media.name !== name);

      queryClient.setQueryData(
        [session_id, station_id, "drillStationMedia"],
        newMedia,
      );

      return {
        rollback: () =>
          queryClient.setQueryData(
            [session_id, station_id, "drillStationMedia"],
            previousMedia,
          ),
      };
    },

    onSuccess: (_, { name, station_id, session_id }) => {
      const oldMedia = queryClient.getQueryData([
        "drillStationMedia",
        station_id,
      ]) as SignedUrls[] | undefined;

      const updatedMedia = oldMedia?.filter((media) => media.name !== name);

      queryClient.setQueryData(
        [session_id, station_id, "drillStationMedia"],
        updatedMedia,
      );
    },

    onError: (error, _, context) => {
      console.error(error);
      if (context) {
        context.rollback();
      }
    },
  });
};

export default useDeleteMedia;
