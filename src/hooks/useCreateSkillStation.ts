import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createSkillStation,
  getSkillStations,
} from "~/services/supabaseFunctions";
import { SkillStationType } from "~/utils/types";

const useCreateSkillStation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await createSkillStation();
      return await getSkillStations();
    },

    onMutate: () => {
      queryClient.cancelQueries({ queryKey: ["stations"] });

      const previousStations = queryClient.getQueryData(["stations"]) || [];

      queryClient.setQueryData(
        ["stations"],
        (old: SkillStationType[] | undefined) => {
          const tempId = Math.floor(Math.random() * 1000000000);
          const tempOrder = Math.floor(Math.random() * 1000000000);

          const newStation = {
            id: tempId,
            name: "",
            duration: "00:00:00",
            order: tempOrder,
            skills: [],
            show_duration: false,
          };

          if (old === undefined) {
            return [newStation];
          }
          return [...old, newStation];
        },
      );

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

export default useCreateSkillStation;
