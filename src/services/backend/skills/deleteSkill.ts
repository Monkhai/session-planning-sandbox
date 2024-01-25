import client from "~/utils/supabaseClient";

export default async (skill_id: number) => {
  try {
    const { data, error } = await client
      .from("skills")
      .delete()
      .eq("id", skill_id);

    if (error) {
      throw error;
    }
  } catch (error) {
    throw error;
  }
};
