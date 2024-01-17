import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import { createDrillStation } from "~/services/supabaseFunctions";
import { SignedUrls, Station, drillStationType } from "~/utils/types";

const useCreateDrillStation = () => {
  return useMutation({
    mutationFn: async (lastOrder: number) => {
      return await createDrillStation(lastOrder);
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
        comments: "",
        description: "",
        mediaUrls: [] as SignedUrls[],
      } as drillStationType;

      const newStations = [...previousStations, newStation];

      queryClient.setQueryData(["stations"], newStations);

      return {
        rollback: () =>
          queryClient.setQueryData(["stations"], previousStations),
        optimisticStation: newStation,
      };
    },

    onSuccess: (stationFromDB, _, { optimisticStation }) => {
      const previousStations: Station[] =
        queryClient.getQueryData(["stations"]) ?? [];

      const newStation = stationFromDB[0];

      const newStationWithMedia = {
        ...newStation,
        mediaUrls: [] as SignedUrls[],
      } as drillStationType;

      const newStations = previousStations.map((station) => {
        if (
          station.id === optimisticStation.id &&
          station.type === "drillStation"
        ) {
          return newStationWithMedia;
        }
        return station;
      });

      queryClient.setQueryData(["stations"], newStations);
    },

    onError: (error, _, context) => {
      if (context) {
        context.rollback();
        return error;
      }
    },
  });
};

export default useCreateDrillStation;
