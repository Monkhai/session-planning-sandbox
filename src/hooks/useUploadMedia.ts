import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllStations,
  uploadDrillStationMedia,
} from "~/services/supabaseFunctions";
import { Station, UploadMediaArgs } from "~/utils/types";

const useUploadMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ station_id, file }: UploadMediaArgs) => {
      await uploadDrillStationMedia(station_id, file);
      return await getAllStations();
    },

    onSuccess: (data) => {
      queryClient.setQueryData<Station[]>(["stations"], data);
    },

    onError: (error) => {
      return error;
    },
  });
};

export default useUploadMedia;
