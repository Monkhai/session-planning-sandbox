import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createStation, getStations } from "~/services/supabaseFunctions";
import { Station } from "~/utils/types";

const useCreateStation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await createStation();
      return await getStations();
    },

    onMutate: () => {
      queryClient.cancelQueries({ queryKey: ["stations"] });

      const previousStations = queryClient.getQueryData(["stations"]) || [];

      queryClient.setQueryData(["stations"], (old: Station[] | undefined) => {
        const tempId = Math.floor(Math.random() * 1000000000);
        const tempOrder = Math.floor(Math.random() * 1000000000);

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
