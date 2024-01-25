import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import decrementSkillOrder from "~/services/backend/skills/decrementSkillOrder";
import deleteSkill from "~/services/backend/skills/deleteSkill";
import { SkillStationType, SkillStationWithSkillsType } from "~/utils/types";

const useDeleteSkill = () => {
  return useMutation({
    mutationFn: async ({ id }: { id: number; station_id: number }) => {
      await deleteSkill(id);
    },

    onMutate: ({ id, station_id }: { id: number; station_id: number }) => {
      queryClient.cancelQueries({ queryKey: ["stations"] });

      const previousStations: SkillStationWithSkillsType[] =
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

      const index = targetStation.skills.findIndex((skill) => skill.id === id);

      const skillToUpdate = targetStation.skills.slice(index);

      const newSkills = targetStation.skills.filter((skill) => skill.id !== id);

      const updatedSkills = newSkills.map((skill) => {
        if (skill.order > index) {
          return { ...skill, order: skill.order - 1 };
        }
        return skill;
      });

      const newStation = {
        ...targetStation,
        skills: updatedSkills,
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
        skillToUpdate: skillToUpdate,
      };
    },

    onSuccess: async (_, { id, station_id }, { skillToUpdate }) => {
      try {
        for (const skill of skillToUpdate) {
          if (skill.id !== id) {
            await decrementSkillOrder(skill);
          }
        }
      } catch (error) {
        console.error(error);
      }

      return;
    },

    onError: (error, _, context) => {
      console.error(error);
      if (context) {
        context.rollback();
      }
      return error;
    },
  });
};

export default useDeleteSkill;
