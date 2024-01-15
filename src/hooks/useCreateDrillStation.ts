import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import {
  createDrillStation,
  getAllStations,
} from "~/services/supabaseFunctions";
import { Station, drillStationType } from "~/utils/types";

const useCreateDrillStation = () => {
  return useMutation({
    mutationFn: async (lastOrder: number) => {
      await createDrillStation(lastOrder);
      return await getAllStations();
    },

    onMutate: (lastOrder: number) => {
      queryClient.cancelQueries({ queryKey: ["stations"] });

      const previousStations: Station[] =
        queryClient.getQueryData(["stations"]) ?? [];

      const tempId = Math.floor(Math.random() * 1000000000);

      const newStation = {
        id: tempId,
        name: "",
        duration: "00:00:00",
        order: lastOrder,
        show_duration: false,
        show_comments: false,
        show_edit_media: false,
        type: "drillStation",
        show_media: false,
      } as drillStationType;

      const newStations = [...previousStations, newStation];

      queryClient.setQueryData(["stations"], newStations);

      return () => queryClient.setQueryData(["stations"], previousStations);
    },

    onSuccess: (newStations) => {
      // queryClient.setQueryData(["stations"], newStations);
      queryClient.invalidateQueries({ queryKey: ["stations"] });
    },

    onError: (error, _, rollback) => {
      if (rollback) {
        rollback();
        return error;
      }
    },
  });
};

export default useCreateDrillStation;
