import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import { FaChessKing } from "react-icons/fa6";
import createSkill from "~/services/backend/skills/createSkill";
import getUserId from "~/services/backend/userManagement/getUserId";
import client from "~/utils/supabaseClient";
import {
  CreateSkillArgs,
  SkillStationType,
  SkillStationWithSkillsType,
  SkillType,
  Station,
} from "~/utils/types";
const useCreateSkill = () => {
  return useMutation({
    mutationFn: async ({
      station_id,
      lastOrder,
      session_id,
    }: CreateSkillArgs) => {
      return await createSkill(station_id, lastOrder);
    },

    onMutate: async ({ station_id, session_id }) => {
      await queryClient.cancelQueries({
        queryKey: ["sessions", session_id, "stations"],
      });
      const user_id = getUserId();
      if (!user_id) {
        console.error("User not found");
        return;
      }

      const previousStations: Station[] =
        queryClient.getQueryData(["sessions", session_id, "stations"]) ?? [];

      const parentStation = previousStations.find(
        (station) => station.id === station_id,
      ) as SkillStationWithSkillsType;
      if (parentStation === undefined) {
        throw new Error("No parent station");
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

      queryClient.setQueryData(
        ["sessions", session_id, "stations"],
        newStations,
      );

      return {
        rollback: () =>
          queryClient.setQueryData(
            ["sessions", session_id, "stations"],
            previousStations,
          ),
        newSkill,
      };
    },

    onSuccess: (data, { session_id }, { newSkill }) => {
      if (!data) {
        return;
      }

      const previousStations: SkillStationWithSkillsType[] =
        queryClient.getQueryData(["sessions", session_id, "stations"]) ?? [];

      const parentStation = previousStations.find(
        (station) => station.id === data.station_id,
      );

      if (!parentStation) {
        return;
      }

      const newSkills = parentStation.skills.map((skill) => {
        if (skill.id === newSkill.id) {
          return data;
        }
        return skill;
      });

      const newStations = previousStations.map((station) => {
        if (station.id === data.station_id && station.type === "skillStation") {
          return {
            ...station,
            skills: newSkills,
          };
        }
        return station;
      });

      queryClient.setQueryData(
        ["sessions", session_id, "stations"],
        newStations,
      );
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

export default useCreateSkill;
