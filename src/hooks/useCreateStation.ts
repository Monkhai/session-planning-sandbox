import { useMutation } from "@tanstack/react-query";
import { queryClient } from "Providers/ReactQueryProvider";
import getUserId from "~/services/backend/userManagement/getUserId";
import {
  DrillStationType,
  DrillStationWithDrillsType,
  SkillStationType,
  SkillStationWithSkillsType,
  Station,
  StationType,
} from "~/utils/types";

type BaseStationType = {
  id: number;
  name: string;
  duration: string;
  order: number;
  show_duration: boolean;
  user_id: string;
};

const useCreateStation = (
  createStationFn: (
    lastOrder: number,
  ) => Promise<SkillStationType[] | DrillStationType[]>,
  stationType: StationType,
) => {
  return useMutation({
    mutationFn: async (lastOrder: number) => {
      return await createStationFn(lastOrder);
    },

    onMutate: (lastOrder: number) => {
      queryClient.cancelQueries({ queryKey: ["stations"] });

      const user_id = getUserId();
      if (user_id === null) {
        throw new Error("user_id is null");
      }

      const previousStations = queryClient.getQueryData(["stations"]) ?? [];
      const tempId = Math.floor(Math.random() * 1000000000);
      let newStation: SkillStationWithSkillsType | DrillStationWithDrillsType;

      const baseStation: BaseStationType = {
        id: tempId,
        name: "",
        duration: "00:00:00",
        order: lastOrder,
        show_duration: true,
        user_id: user_id,
      };

      if (stationType === "drillStation") {
        newStation = {
          ...baseStation,
          drills: [],
          type: stationType,
        } as DrillStationWithDrillsType;
      } else {
        newStation = {
          ...baseStation,
          skills: [],
          type: stationType,
        } as SkillStationWithSkillsType;
      }

      queryClient.setQueryData(
        ["stations"],
        (old: DrillStationWithDrillsType[] | undefined) => {
          if (old === undefined) {
            return [newStation];
          }
          return [...old, newStation];
        },
      );

      return {
        rollback: () =>
          queryClient.setQueryData(["stations"], previousStations),
        optimisticStation: newStation,
      };
    },

    onSuccess: (newStation, _, { optimisticStation }) => {
      const previousStations: DrillStationWithDrillsType[] =
        queryClient.getQueryData(["stations"]) ?? [];

      const newStations = previousStations.map((station) => {
        if (
          station.id === optimisticStation.id &&
          station.type === "drillStation"
        ) {
          return newStation[0];
        }
        return station;
      });

      queryClient.setQueryData(["stations"], newStations);
    },

    onError: (error, _, context) => {
      if (context) {
        context.rollback();
        return error;
      }
    },
  });
};

export default useCreateStation;
