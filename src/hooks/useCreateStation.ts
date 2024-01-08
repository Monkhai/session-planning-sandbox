import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStation, getStations } from "~/services/supabaseFunctions";
import { CreateStationArgs, Station } from "~/utils/types";

const useCreateStation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId }: CreateStationArgs) => {
      await createStation(userId);
      return await getStations();
    },

    onMutate: () => {
      const previousStations = queryClient.getQueryData(["stations"]) || [];

      queryClient.setQueryData(["stations"], (old: Station[] | undefined) => {
        let tempId = 1;
        let tempOrder = 1;

        if (old !== undefined) {
          if (old.length > 0) {
            const lastStation = old[old.length - 1];

            if (lastStation) {
              tempId = lastStation.id + 1;
              tempOrder = lastStation.order + 1;
            }
          }
        }

        const newStation = {
          id: tempId,
          name: "",
          duration: "00:00:00",
          order: tempOrder,
          skills: [],
        };

        if (old === undefined) {
          return [newStation];
        }
        return [...old, newStation];
      });

      return () => queryClient.setQueryData(["stations"], previousStations);
    },

    onSuccess: (data) => {
      queryClient.setQueryData(["stations"], data);
    },

    onError: (error, _, rollback) => {
      if (rollback) {
        rollback();
        return error;
      }
    },
  });
};

export default useCreateStation;
