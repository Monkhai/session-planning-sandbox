import client from "~/utils/supabaseClient";
import getUserId from "../../userManagement/getUserId";
import { PostgrestSingleResponse } from "@supabase/supabase-js";

export default async (station_ids: number[]) => {
  try {
    const user_id = getUserId();

    if (!user_id) {
      throw new Error("User not logged in");
    }

    const { data, error }: PostgrestSingleResponse<{ skill_id: number }[]> =
      await client
        .from("skills_of_skill_stations")
        .select("skill_id")
        .in("skill_station_id", station_ids);

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error("No data");
    }

    const skill_ids = data.map((skill) => skill.skill_id);

    return skill_ids;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
