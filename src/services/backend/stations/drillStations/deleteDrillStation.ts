import client from "~/utils/supabaseClient";

export default async (station_id: number, drillIds: number[]) => {
  try {
    const { error } = await client
      .from("drill_stations")
      .delete()
      .eq("id", station_id);

    if (error) {
      throw error;
    }

    const { error: drillsError } = await client
      .from("drills")
      .delete()
      .in("id", drillIds);

    if (drillsError) {
      throw drillsError;
    }
  } catch (error) {
    throw error;
  }
};
