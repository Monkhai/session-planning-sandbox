import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import { deleteMedia, getAllStations } from "~/services/supabaseFunctions";
import { Station, drillStationType } from "~/utils/types";

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
      const previousStations: Station[] =
        queryClient.getQueryData(["stations"]) ?? [];

      const station = previousStations.find(
        (station) => station.id === station_id,
      ) as drillStationType;

      const newStation = station.mediaUrls.filter(
        (media) => media.name !== name,
      );

      const newStations = previousStations.map((station) => {
        if (station.id === station_id) {
          return { ...station, mediaUrls: newStation };
        }
        return station;
      });

      queryClient.setQueryData(["stations"], newStations);

      return () => {
        queryClient.setQueryData(["stations"], previousStations);
      };
    },

    onSuccess: (_, { name, station_id }) => {
      const previousStations: Station[] =
        queryClient.getQueryData(["stations"]) ?? [];

      const station = previousStations.find(
        (station) =>
          station.id === station_id && station.type === "drillStation",
      ) as drillStationType;

      const newStation = station.mediaUrls.filter(
        (media) => media.name !== name,
      );

      const newStations = previousStations.map((station) => {
        if (station.id === station_id) {
          return { ...station, mediaUrls: newStation };
        }
        return station;
      });

      queryClient.setQueryData(["stations"], newStations);
    },

    onError: (error) => {
      throw error;
    },
  });
};

export default useDeleteMedia;
