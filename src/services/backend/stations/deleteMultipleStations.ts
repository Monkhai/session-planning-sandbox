import client from "~/utils/supabaseClient";

export default async (station_ids: number[]) => {
  try {
    const { error } = await client
      .from("stations")
      .delete()
      .in("id", station_ids);

    if (error) {
      throw error;
    }
  } catch (error) {
    throw error;
  }
};
