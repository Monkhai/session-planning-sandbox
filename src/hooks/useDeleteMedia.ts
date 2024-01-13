import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMedia, getAllStations } from "~/services/supabaseFunctions";

const useDeleteMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      station_id,
    }: {
      name: string;
      station_id: number;
    }) => {
      await deleteMedia(name, station_id);
      return await getAllStations();
    },

    onSuccess: (data) => {
      queryClient.setQueryData(["stations"], data);
    },

    onError: (error) => {
      throw error;
    },
  });
};

export default useDeleteMedia;
