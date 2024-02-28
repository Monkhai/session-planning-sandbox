import client from "~/utils/supabaseClient";
import { Station } from "~/utils/types";

export default async (station: Station) => {
  try {
    const { data, error } = await client
      .from("stations_of_sessions")
      .update({ order: station.order - 1 })
      .eq("station_id", station.id)
      .select();

    if (error) {
      console.error(error);
      throw error;
    }

    if (!data) {
      console.error("No data");
      throw new Error("No data");
    }

    return data[0] as Station;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
