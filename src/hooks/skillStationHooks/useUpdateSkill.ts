import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import updateSkill from "~/services/backend/skills/updateSkill";
import {
  SkillStationType,
  SkillStationWithSkillsType,
  updateSkillArgs,
} from "~/utils/types";

const useUpdateSkill = () => {
  return useMutation({
    mutationFn: async ({
      skill_id,
      name,
      repetitions,
      description,
      show_reps,
    }: updateSkillArgs) => {
      await updateSkill(skill_id, name, repetitions, description, show_reps);
    },

    onMutate: ({
      skill_id,
      name,
      repetitions,
      description,
      station_id,
      show_reps,
      session_id,
    }: updateSkillArgs) => {
      queryClient.cancelQueries({
        queryKey: ["sessions", session_id, "stations"],
      });

      const previousStations: SkillStationWithSkillsType[] =
        queryClient.getQueryData(["sessions", session_id, "stations"]) ?? [];

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

      queryClient.setQueryData(
        ["sessions", session_id, "stations"],
        newStations,
      );

      return () => {
        queryClient.setQueryData(
          ["sessions", session_id, "stations"],
          previousStations,
        );
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
