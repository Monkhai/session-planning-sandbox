import client from "~/utils/supabaseClient";

export default async (station_id: number) => {
  try {
    const { data, error } = await client
      .from("stations")
      .delete()
      .eq("id", station_id);

    if (error) {
      throw error;
    }
  } catch (error) {
    throw error;
  }
};
