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
    }: updateSkillArgs) => {
      const previousStations: SkillStationType[] =
        queryClient.getQueryData(["stations"]) || [];
      const newStations: SkillStationType[] = previousStations.map(
        (station) => {
          const newSkills = station.skills.map((skill) => {
            if (skill.id === skill_id) {
              return { ...skill, name, repetitions, description };
            }
            return skill;
          });
          return { ...station, skills: newSkills };
        },
      );
      queryClient.setQueryData(["stations"], newStations);

      return () => {
        queryClient.setQueryData(["stations"], previousStations);
      };
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

export default useUpdateSkill;
