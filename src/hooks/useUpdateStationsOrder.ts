import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import updateStationsOrder from "~/services/backend/stations/updateStationsOrder";
import { queryKeyFactory } from "~/utils/queryFactories";
import { Station } from "~/utils/types";
type Args = {
  stations: Station[];
  session_id: string;
};
const useUpdateStationsOrder = () => {
  return useMutation({
    mutationFn: async ({ stations }: Args) => {
      return await updateStationsOrder(stations);
    },

    onMutate: async ({ stations, session_id }: Args) => {
      const queryKey = queryKeyFactory.stations({ session_id });
      const previousStations: Station[] =
        queryClient.getQueryData(queryKey) ?? [];

      const orderedStations = stations.map((station, index) => {
        return { ...station, order: index + 1 };
      });

      queryClient.setQueryData(queryKey, orderedStations);

      return {
        rollback: () => queryClient.setQueryData(queryKey, previousStations),
        queryKey,
      };
    },

    onSuccess: async (data, _, { queryKey, rollback }) => {
      if (!data) {
        rollback();
        throw new Error("No data returned from updateStationsOrder");
      }

      queryClient.setQueryData(queryKey, data);
    },

    onError: (error, _, context) => {
      console.error(error);
      if (context) context.rollback();
    },
  });
};
export default useUpdateStationsOrder;
