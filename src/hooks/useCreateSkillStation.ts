import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import { createSkillStation } from "~/services/supabaseFunctions";
import { SkillStationType } from "~/utils/types";

const useCreateSkillStation = () => {
  return useMutation({
    mutationFn: async (lastOrder: number) => {
      return await createSkillStation(lastOrder);
    },

    onMutate: (lastOrder: number) => {
      queryClient.cancelQueries({ queryKey: ["stations"] });
      const previousStations = queryClient.getQueryData(["stations"]) ?? [];
      const tempId = Math.floor(Math.random() * 1000000000);

      const newStation = {
        id: tempId,
        name: "",
        duration: "00:00:00",
        order: lastOrder,
        skills: [],
        show_duration: false,
        type: "skillStation",
      };

      queryClient.setQueryData(
        ["stations"],
        (old: SkillStationType[] | undefined) => {
          if (old === undefined) {
            return [newStation];
          }
          return [...old, newStation];
        },
      );

      return {
        rollback: () =>
          queryClient.setQueryData(["stations"], previousStations),
        optimisticStation: newStation,
      };
    },

    onSuccess: (newStation, _, { optimisticStation }) => {
      const previousStations: SkillStationType[] =
        queryClient.getQueryData(["stations"]) ?? [];

      const newStations = previousStations.map((station) => {
        if (
          station.id === optimisticStation.id &&
          station.type === "skillStation"
        ) {
          return newStation[0];
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

export default useCreateSkillStation;
