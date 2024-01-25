import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import deleteMultipleSkills from "~/services/backend/skills/deleteMultipleSkills";
import deleteSkill from "~/services/backend/skills/deleteSkill";
import decrementStationOrder from "~/services/backend/stations/decrementStationOrder";
import deleteSkillStation from "~/services/backend/stations/skillStations/deleteSkillStation";
import { SkillType, Station } from "~/utils/types";

const useDeleteSkillStation = () => {
  return useMutation({
    mutationFn: async ({
      station_id,
      skills,
    }: {
      station_id: number;
      skills: SkillType[];
    }) => {
      if (skills) {
        const skillsId = skills.map((skill) => skill.id);
        deleteMultipleSkills(skillsId);
      }
      await deleteSkillStation(station_id);
    },

    onMutate: ({ station_id }: { station_id: number; skills: SkillType[] }) => {
      queryClient.cancelQueries({ queryKey: ["stations"] });

      const previousStations: Station[] =
        queryClient.getQueryData(["stations"]) ?? [];

      const index = previousStations.findIndex(
        (station) =>
          station.id === station_id && station.type === "skillStation",
      );

      const newStations = previousStations.filter((station) => {
        return station.type !== "skillStation" || station.id !== station_id;
      });

      const stationsToUpdate = newStations.slice(index);

      const newStationsWithUpdatedOrder = newStations.map((station) => {
        if (station.order > index) {
          return { ...station, order: station.order - 1 };
        }
        return station;
      });

      queryClient.setQueryData(["stations"], newStationsWithUpdatedOrder);

      return {
        rollback: () =>
          queryClient.setQueryData(["stations"], previousStations),
        stationsToUpdate: stationsToUpdate,
      };
    },

    onSuccess: async (_, __, { rollback, stationsToUpdate }) => {
      try {
        for (const station of stationsToUpdate) {
          await decrementStationOrder(station);
        }
      } catch (error) {
        console.error(error);
        rollback();
      }
      return;
    },

    onError: (error, _, context) => {
      console.error(error.message);
      if (context) {
        context.rollback();
        return error;
      }
    },
  });
};

export default useDeleteSkillStation;