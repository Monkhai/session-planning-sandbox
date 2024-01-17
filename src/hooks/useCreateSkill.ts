import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import { createSkill, getUserId } from "~/services/supabaseFunctions";
import client from "~/utils/supabaseClient";
import { CreateSkillArgs, SkillStationType, SkillType } from "~/utils/types";
const useCreateSkill = () => {
  return useMutation({
    mutationFn: async ({ station_id }: CreateSkillArgs) => {
      return await createSkill(station_id);
    },

    onMutate: async ({ station_id }: CreateSkillArgs) => {
      await queryClient.cancelQueries({ queryKey: ["stations"] });
      const user_id = getUserId();
      if (!user_id) {
        console.error("User not found");
        return;
      }

      const previousStations: SkillStationType[] =
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
        station_id,
        name: "",
        repetitions: 0,
        order: tempOrder,
        user_id,
      } as SkillType;

      parentStation.skills.push(newSkill);

      const newStations = previousStations.map((station) => {
        if (station.id === station_id && station.type === "skillStation") {
          return parentStation;
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

      const skillFromDB = data[0];

      if (!skillFromDB) {
        return;
      }

      const previousStations: SkillStationType[] =
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
