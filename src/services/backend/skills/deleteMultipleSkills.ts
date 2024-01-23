import client from "~/utils/supabaseClient";

export default async (skill_ids: number[]) => {
  try {
    const { data, error } = await client
      .from("skills")
      .delete()
      .in("id", skill_ids);

    if (error) {
      throw error;
    }
  } catch (error) {
    throw error;
  }
};
