import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import createSkill from "~/services/backend/skills/createSkill";
import getUserId from "~/services/backend/userManagement/getUserId";
import { queryKeyFactory } from "~/utils/queryFactories";
import { SkillStationWithSkillsType, SkillType, Station } from "~/utils/types";

type Args = {
  station_id: number;
  lastOrder: number;
  session_id: string;
};

const useCreateSkill = () => {
  return useMutation({
    mutationFn: async ({ station_id, lastOrder }: Args) => {
      return await createSkill(station_id, lastOrder);
    },

    onMutate: async ({ station_id, lastOrder, session_id }) => {
      const queryKey = queryKeyFactory.stations({ session_id });
      await queryClient.cancelQueries({
        queryKey: queryKey,
      });
      const user_id = getUserId();
      if (!user_id) {
        console.error("User not found");
        return;
      }

      const previousStations: Station[] =
        queryClient.getQueryData(queryKey) ?? [];

      const parentStation = previousStations.find(
        (station) => station.id === station_id,
      ) as SkillStationWithSkillsType;
      if (parentStation === undefined) {
        throw new Error("No parent station");
      }

      const tempId = Math.floor(Math.random() * 1000000000);

      const newSkill = {
        id: tempId,
        skillOfStationId: tempId,
        description: "",
        station_id,
        name: "",
        repetitions: 0,
        order: lastOrder + 1,
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

      queryClient.setQueryData(queryKey, newStations);

      return {
        rollback: () => queryClient.setQueryData(queryKey, previousStations),
        newSkill,
        queryKey,
      };
    },

    onSuccess: (data, _, { newSkill, queryKey }) => {
      if (!data) {
        return;
      }

      const previousStations: SkillStationWithSkillsType[] =
        queryClient.getQueryData(queryKey) ?? [];

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

      queryClient.setQueryData(queryKey, newStations);
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
