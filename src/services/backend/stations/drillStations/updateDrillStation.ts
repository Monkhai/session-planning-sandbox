import client from "~/utils/supabaseClient";
import { UpdateDrillStationArgs } from "~/utils/types";

export default async ({
  duration,
  name,
  show_duration,
  station_id,
}: UpdateDrillStationArgs) => {
  try {
    const { data, error } = await client
      .from("drills")
      .update({
        name: name,
        duration: duration,
        show_duration: show_duration,
      })
      .eq("id", station_id);

    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
};
