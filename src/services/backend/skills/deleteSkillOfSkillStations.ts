import client from "~/utils/supabaseClient";

export default async (id: number) => {
  try {
    const { error } = await client
      .from("skills_of_skill_stations")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }
  } catch (error) {
    throw error;
  }
};
