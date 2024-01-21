import client from "~/utils/supabaseClient";
import { Station } from "~/utils/types";

export default async (station: Station) => {
  const stationType = {
    skillStation: "skill_stations",
    drillStation: "drill_stations",
  };

  try {
    const { data, error } = await client
      .from(stationType[station.type])
      .update({ order: station.order - 1 })
      .eq("id", station.id)
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
