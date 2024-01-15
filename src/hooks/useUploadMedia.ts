import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import {
  getAllStations,
  uploadDrillStationMedia,
} from "~/services/supabaseFunctions";
import { Station, UploadMediaArgs } from "~/utils/types";

const useUploadMedia = () => {
  return useMutation({
    mutationFn: async ({ station_id, file }: UploadMediaArgs) => {
      await uploadDrillStationMedia(station_id, file);
      return await getAllStations();
    },

    onSuccess: (data) => {
      // queryClient.setQueryData<Station[]>(["stations"], data);
      queryClient.invalidateQueries({ queryKey: ["stations"] });
    },

    onError: (error) => {
      return error;
    },
  });
};

export default useUploadMedia;
