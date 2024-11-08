import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import deleteMultipleSkills from "~/services/backend/skills/deleteMultipleSkills";
import decrementStationOrder from "~/services/backend/stations/decrementStationOrder";
import deleteStation from "~/services/backend/stations/deleteStation";
import { queryKeyFactory } from "~/utils/queryFactories";
import { SkillType, Station } from "~/utils/types";

type Args = {
  station_id: number;
  skills: SkillType[];
  session_id: string;
};

const useDeleteSkillStation = () => {
  return useMutation({
    mutationFn: async ({ station_id, skills }: Args) => {
      if (skills) {
        const skillsId = skills.map((skill) => skill.id);
        deleteMultipleSkills(skillsId);
      }
      return await deleteStation(station_id);
    },

    onMutate: ({ station_id, session_id }) => {
      const queryKey = queryKeyFactory.stations({ session_id });
      queryClient.cancelQueries({
        queryKey: queryKey,
      });
      const previousStations: Station[] =
        queryClient.getQueryData(queryKey) ?? [];

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

      queryClient.setQueryData(queryKey, newStationsWithUpdatedOrder);

      return {
        rollback: () => queryClient.setQueryData(queryKey, previousStations),
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
