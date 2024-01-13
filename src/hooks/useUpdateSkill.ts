import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllStations, updateSkill } from "~/services/supabaseFunctions";
import { SkillStationType, updateSkillArgs } from "~/utils/types";

const useUpdateSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["stations"],
    mutationFn: async ({
      skill_id,
      name,
      repetitions,
      description,
    }: updateSkillArgs) => {
      await updateSkill(skill_id, name, repetitions, description);
      return await getAllStations();
    },

    onMutate: ({
      skill_id,
      name,
      repetitions,
      description,
      station_id,
    }: updateSkillArgs) => {
      const previousStations: SkillStationType[] =
        queryClient.getQueryData(["stations"]) ?? [];

      const targetStation = previousStations.find(
        (station) =>
          station.type === "skillStation" && station.id === station_id,
      );

      if (!targetStation) {
        throw new Error("Station not found");
      }

      const targetSkill = targetStation.skills.find(
        (skill) => skill.id === skill_id,
      );

      if (!targetSkill) {
        throw new Error("Skill not found");
      }

      const newSkill = {
        ...targetSkill,
        name,
        repetitions,
        description,
      };

      const newStation = {
        ...targetStation,
        skills: targetStation.skills.map((skill) =>
          skill.id === skill_id ? newSkill : skill,
        ),
      };

      const newStations = previousStations.map((station) => {
        if (station.type === "skillStation" && station.id === station_id) {
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
      console.log(data);
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

export default useUpdateSkill;
