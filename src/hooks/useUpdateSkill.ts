import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getStations, updateSkill } from "~/services/supabaseFunctions";
import { Station, updateSkillArgs } from "~/utils/types";

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
      return await getStations();
    },

    onMutate: ({
      skill_id,
      name,
      repetitions,
      description,
    }: updateSkillArgs) => {
      const previousStations: Station[] =
        queryClient.getQueryData(["stations"]) || [];
      const newStations: Station[] = previousStations.map((station) => {
        const newSkills = station.skills.map((skill) => {
          if (skill.id === skill_id) {
            return { ...skill, name, repetitions, description };
          }
          return skill;
        });
        return { ...station, skills: newSkills };
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
      if (rollback) {
        rollback();
        return error;
      }
    },
  });
};

export default useUpdateSkill;
