import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import { deleteMedia } from "~/services/supabaseFunctions";
import { SignedUrls } from "~/utils/types";

const useDeleteMedia = () => {
  return useMutation({
    mutationFn: async ({
      name,
      station_id,
    }: {
      name: string;
      station_id: number;
    }) => {
      await deleteMedia(name, station_id);
    },

    onMutate: async ({
      name,
      station_id,
    }: {
      name: string;
      station_id: number;
    }) => {
      const previousMedia = queryClient.getQueryData([
        "drillStationMedia",
        station_id,
      ]) as SignedUrls[] | undefined;

      const newMedia = previousMedia?.filter((media) => media.name !== name);

      console.log(newMedia, "delete media mutate");

      queryClient.setQueryData(["drillStationMedia", station_id], newMedia);

      return {
        rollback: () =>
          queryClient.setQueryData(
            ["drillStationMedia", station_id],
            previousMedia,
          ),
      };
    },

    onSuccess: (_, { name, station_id }) => {
      const oldMedia = queryClient.getQueryData([
        "drillStationMedia",
        station_id,
      ]) as SignedUrls[] | undefined;

      const updatedMedia = oldMedia?.filter((media) => media.name !== name);
      console.log(updatedMedia, "delete media");
      queryClient.setQueryData(["drillStationMedia", station_id], updatedMedia);
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
