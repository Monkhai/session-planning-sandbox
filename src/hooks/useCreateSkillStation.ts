import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import { createSkillStation } from "~/services/supabaseFunctions";
import { SkillStationType } from "~/utils/types";

const useCreateSkillStation = () => {
  return useMutation({
    mutationFn: async (lastOrder: number) => {
      const data = await createSkillStation(lastOrder);
      return data;
      // return await getAllStations();
    },

    onMutate: (lastOrder: number) => {
      queryClient.cancelQueries({ queryKey: ["stations"] });
      const previousStations = queryClient.getQueryData(["stations"]) ?? [];
      const tempId = Math.floor(Math.random() * 1000000000);
      queryClient.setQueryData(
        ["stations"],
        (old: SkillStationType[] | undefined) => {
          const newStation = {
            id: tempId,
            name: "",
            duration: "00:00:00",
            order: lastOrder,
            skills: [],
            show_duration: false,
            type: "skillStation",
          };
          if (old === undefined) {
            return [newStation];
          }
          return [...old, newStation];
        },
      );

      return () => queryClient.setQueryData(["stations"], previousStations);
    },

    onSuccess: (newStations) => {
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

export default useCreateSkillStation;
