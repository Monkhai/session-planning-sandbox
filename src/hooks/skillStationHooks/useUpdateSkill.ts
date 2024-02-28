import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import updateSkill from "~/services/backend/skills/updateSkill";
import { queryKeyFactory } from "~/utils/queryFactories";
import { SkillStationWithSkillsType } from "~/utils/types";
type Args = {
  skill_id: number;
  name: string;
  repetitions: number;
  description: string;
  station_id: number;
  show_reps: boolean;
  session_id: string;
  order: number;
  skillOfStationId: number;
};
const useUpdateSkill = () => {
  return useMutation({
    mutationFn: async ({
      skill_id,
      name,
      repetitions,
      description,
      show_reps,
      order,
      skillOfStationId,
    }: Args) => {
      await updateSkill({
        skill_id,
        name,
        repetitions,
        description,
        show_reps,
        order,
        skillOfStationId,
      });
    },

    onMutate: ({
      skill_id,
      name,
      repetitions,
      description,
      station_id,
      show_reps,
      session_id,
    }) => {
      const queryKey = queryKeyFactory.stations({ session_id });
      queryClient.cancelQueries({
        queryKey: queryKey,
      });

      const previousStations: SkillStationWithSkillsType[] =
        queryClient.getQueryData(queryKey) ?? [];

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
        show_reps,
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

      queryClient.setQueryData(queryKey, newStations);

      return () => {
        queryClient.setQueryData(queryKey, previousStations);
      };
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
