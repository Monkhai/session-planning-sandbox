import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import deleteMedia from "~/services/backend/drills/media/deleteMedia";
import { queryKeyFactory } from "~/utils/queryFactories";
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
      const queryKey = queryKeyFactory.drillMedia({
        session_id,
        drill_id: station_id,
      });

      const previousMedia = queryClient.getQueryData(queryKey) as
        | SignedUrls[]
        | undefined;

      const newMedia = previousMedia?.filter((media) => media.name !== name);

      queryClient.setQueryData(queryKey, newMedia);

      return {
        rollback: () => queryClient.setQueryData(queryKey, previousMedia),
        queryKey,
      };
    },

    onSuccess: (_, { name }, { queryKey }) => {
      const oldMedia = queryClient.getQueryData(queryKey) as
        | SignedUrls[]
        | undefined;

      const updatedMedia = oldMedia?.filter((media) => media.name !== name);

      queryClient.setQueryData(queryKey, updatedMedia);
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
