import client from "~/utils/supabaseClient";
import getUserId from "../../userManagement/getUserId";
import { PostgrestSingleResponse } from "@supabase/supabase-js";

export default async (station_ids: number[]) => {
  try {
    const user_id = getUserId();

    if (!user_id) {
      throw new Error("User not logged in");
    }

    const { data, error }: PostgrestSingleResponse<{ drill_id: number }[]> =
      await client
        .from("drills_of_drill_stations")
        .select("drill_id")
        .in("drill_station_id", station_ids);

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error("No data");
    }

    const drill_ids = data.map((skill) => skill.drill_id);

    return drill_ids;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
