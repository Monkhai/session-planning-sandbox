import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createSkill,
  getStations,
  getUserId,
} from "~/services/supabaseFunctions";
import { CreateSkillArgs, Station } from "~/utils/types";
const useCreateSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ station_id }: CreateSkillArgs) => {
      await createSkill(station_id);
      return await getStations();
    },

    onMutate: async ({ station_id }: CreateSkillArgs) => {
      await queryClient.cancelQueries({ queryKey: ["stations"] });

      const user_id = await getUserId();
      if (!user_id) {
        throw new Error("No user id found");
      }

      const previousStations: Station[] =
        queryClient.getQueryData(["stations"]) || [];
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
      };

      parentStation.skills.push(newSkill);
      const newStations = previousStations.map((station) => {
        if (station.id === station_id) {
          return parentStation;
        }
        return station;
      });

      queryClient.setQueryData(["stations"], newStations);

      return () => queryClient.setQueryData(["stations"], previousStations);
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

export default useCreateSkill;
