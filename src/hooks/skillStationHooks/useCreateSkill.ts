import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import createSkill from "~/services/backend/skills/createSkill";
import getUserId from "~/services/backend/userManagement/getUserId";
import client from "~/utils/supabaseClient";
import {
  CreateSkillArgs,
  SkillStationType,
  SkillStationWithSkillsType,
  SkillType,
} from "~/utils/types";
const useCreateSkill = () => {
  return useMutation({
    mutationFn: async ({ station_id, lastOrder }: CreateSkillArgs) => {
      return await createSkill(station_id, lastOrder);
    },

    onMutate: async ({ station_id }: CreateSkillArgs) => {
      await queryClient.cancelQueries({ queryKey: ["stations"] });
      const user_id = getUserId();
      if (!user_id) {
        console.error("User not found");
        return;
      }

      const previousStations: SkillStationWithSkillsType[] =
        queryClient.getQueryData(["stations"]) ?? [];

      const parentStation = previousStations.find(
        (station) => station.id === station_id,
      );
      if (parentStation === undefined) {
        return;
      }

      const tempId = Math.floor(Math.random() * 1000000000);
      const tempOrder = Math.floor(Math.random() * 1000000000);

      const newSkill = {
        id: tempId,
        skillOfStationId: tempId,
        description: "",
        station_id,
        name: "",
        repetitions: 0,
        order: tempOrder,
        user_id,
        show_reps: true,
      } as SkillType;

      let newSkills = [];

      if (parentStation.skills === undefined) {
        newSkills = [newSkill];
      } else {
        newSkills = [...parentStation.skills, newSkill];
      }

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

      return {
        rollback: () =>
          queryClient.setQueryData(["stations"], previousStations),
        newSkill,
      };
    },

    onSuccess: (data, _, { newSkill }) => {
      if (!newSkill) {
        return;
      }

      if (!data) {
        return;
      }

      const skillFromDB = data;

      if (!skillFromDB) {
        return;
      }

      const previousStations: SkillStationWithSkillsType[] =
        queryClient.getQueryData(["stations"]) ?? [];

      const parentStation = previousStations.find(
        (station) => station.id === newSkill.station_id,
      );

      if (!parentStation) {
        return;
      }

      const newSkills = parentStation.skills.map((skill) => {
        if (skill.id === newSkill.id) {
          return skillFromDB;
        }
        return skill;
      });

      const newStations = previousStations.map((station) => {
        if (
          station.id === newSkill.station_id &&
          station.type === "skillStation"
        ) {
          return {
            ...station,
            skills: newSkills,
          };
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

export default useCreateSkill;
