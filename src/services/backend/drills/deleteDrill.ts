import client from "~/utils/supabaseClient";

export default async (drill_id: number) => {
  try {
    const { data, error } = await client
      .from("drills")
      .delete()
      .eq("id", drill_id);

    if (error) {
      throw error;
    }
  } catch (error) {
    throw error;
  }
};
