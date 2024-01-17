import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import { deleteSkill } from "~/services/supabaseFunctions";
import { SkillStationType } from "~/utils/types";

const useDeleteSkill = () => {
  return useMutation({
    mutationFn: async ({ id }: { id: number; station_id: number }) => {
      await deleteSkill(id);
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

      return {
        rollback: () =>
          queryClient.setQueryData(["stations"], previousStations),
        targetSkill: targetSkill,
      };
    },

    onSuccess: (_, { id, station_id }) => {
      const previousStations: SkillStationType[] =
        queryClient.getQueryData(["stations"]) ?? [];

      const parentStation = previousStations.find(
        (station) =>
          station.id === station_id && station.type === "skillStation",
      );

      if (!parentStation) {
        return;
      }

      const newSkills = parentStation.skills.filter((skill) => skill.id !== id);

      const newStation = {
        ...parentStation,
        skills: newSkills,
      };

      const newStations = previousStations.map((station) => {
        if (station.id === station_id && station.type === "skillStation") {
          return newStation;
        }
        return station;
      });

      queryClient.setQueryData(["stations"], newStations);
    },

    onError: (error, _, context) => {
      console.log(error);
      if (context) {
        context.rollback();
      }
      return error;
    },
  });
};

export default useDeleteSkill;
