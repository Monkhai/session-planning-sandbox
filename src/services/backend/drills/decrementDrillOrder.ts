import client from "~/utils/supabaseClient";
import { DrillType } from "~/utils/types";

export default async (drill: DrillType) => {
  try {
    const { data, error } = await client
      .from("drills_of_drill_stations")
      .update({ order: drill.order - 1 })
      .eq("id", drill.drillOfStationId)
      .select();

    if (error) {
      console.error(error);
      throw error;
    }

    if (!data) {
      console.error("No data");
      throw new Error("No data");
    }

    return data[0] as DrillType;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
