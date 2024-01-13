import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteSkill, getAllStations } from "~/services/supabaseFunctions";
import { SkillStationType } from "~/utils/types";

const useDeleteSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await deleteSkill(id);
      return await getAllStations();
    },

    onMutate: (id: number) => {
      queryClient.cancelQueries({ queryKey: ["stations"] });

      const previousStations: SkillStationType[] =
        queryClient.getQueryData(["stations"]) || [];

      const newStations = previousStations.map((station) => {
        const newSkills = station.skills.filter((skill) => skill.id !== id);
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

export default useDeleteSkill;
