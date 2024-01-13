import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSkill, getAllStations } from "~/services/supabaseFunctions";
import { SkillStationType } from "~/utils/types";

const useDeleteSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      station_id,
    }: {
      id: number;
      station_id: number;
    }) => {
      await deleteSkill(id);
      return await getAllStations();
    },

    onMutate: ({ id, station_id }: { id: number; station_id: number }) => {
      queryClient.cancelQueries({ queryKey: ["stations"] });

      const previousStations: SkillStationType[] =
        queryClient.getQueryData(["stations"]) ?? [];

      const targetStation = previousStations.find(
        (station) =>
          station.id === station_id && station.type === "skillStation",
      );

      if (!targetStation) {
        throw new Error("Station not found");
      }

      const targetSkill = targetStation.skills.find((skill) => skill.id === id);

      if (!targetSkill) {
        throw new Error("Skill not found");
      }

      const newStation = {
        ...targetStation,
        skills: targetStation.skills.filter((skill) => skill.id !== id),
      };

      const newStations = previousStations.map((station) => {
        if (station.id === station_id && station.type === "skillStation") {
          return newStation;
        }
        return station;
      });

      queryClient.setQueryData(["stations"], newStations);

      return () => {
        queryClient.setQueryData(["stations"], previousStations);
      };
    },

    onSuccess: (data) => {
      queryClient.setQueryData(["stations"], data);
    },

    onError: (error, _, rollback) => {
      console.log(error);
      if (rollback) {
        rollback();
      }
      return error;
    },
  });
};

export default useDeleteSkill;
