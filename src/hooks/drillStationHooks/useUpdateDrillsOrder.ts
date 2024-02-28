import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import updateDrillsOrder from "~/services/backend/drills/updateDrillsOrder";
import { queryKeyFactory } from "~/utils/queryFactories";
import { DrillType, Station } from "~/utils/types";

type Args = {
  session_id: string;
  drills: DrillType[];
};

const useUpdateDrillsOrder = () => {
  return useMutation({
    mutationFn: async ({ drills, session_id }: Args) => {
      return await updateDrillsOrder(drills, session_id);
    },

    onMutate: ({ session_id, drills }) => {
      const queryKey = queryKeyFactory.stations({ session_id });

      const previousStations: Station[] =
        queryClient.getQueryData(queryKey) ?? [];

      const station = previousStations.find(
        (station) =>
          station.type === "drillStation" &&
          station.id === drills[0]?.station_id,
      );

      if (!station) {
        throw new Error("No station found");
      }

      const newStation = {
        ...station,
        drills,
      };

      const newStations = previousStations.map((station) => {
        if (station.id === newStation.id) {
          return newStation;
        }
        return station;
      });

      queryClient.setQueryData(queryKey, newStations);

      return {
        rollback: () => queryClient.setQueryData(queryKey, previousStations),
        queryKey,
      };
    },

    onSuccess: async (data, _, { queryKey }) => {
      if (!data) {
        throw new Error("No data returned from updateDrillsOrder");
      }

      const previousStations: Station[] =
        queryClient.getQueryData(queryKey) ?? [];

      const newStations = previousStations.map((station) => {
        if (
          station.type === "drillStation" &&
          station.id === data[0]?.station_id
        ) {
          return {
            ...station,
            drills: data,
          };
        }
        return station;
      });

      queryClient.setQueryData(queryKey, newStations);
    },

    onError: (error, _, context) => {
      console.error(error);
      if (context) context.rollback();
    },
  });
};

export default useUpdateDrillsOrder;
