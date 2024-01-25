import client from "~/utils/supabaseClient";
import { DrillStationType } from "~/utils/types";
import getUserId from "../../userManagement/getUserId";

export default async (station_id: number) => {
  const user_id = getUserId();

  if (!user_id) {
    console.error("User not found");
    return null;
  }

  try {
    const { data, error } = await client
      .from("drill_stations")
      .select()
      .eq("id", station_id);

    if (error || !data) {
      console.error(error);
      return null;
    }

    return data[0] as DrillStationType;
  } catch (error) {
    console.error(error);
    return null;
  }
};
