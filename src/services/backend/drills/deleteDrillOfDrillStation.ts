import client from "~/utils/supabaseClient";

export default async (id: number) => {
  try {
    const { data, error } = await client
      .from("drills_of_drill_stations")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }
  } catch (error) {
    throw error;
  }
};
