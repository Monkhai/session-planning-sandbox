import client from "~/utils/supabaseClient";

export default async (
  skill_id: number,
  name: string,
  repetitions: number,
  description: string,
  show_reps: boolean,
) => {
  try {
    const { data, error } = await client
      .from("skills")
      .update({
        name: name,
        repetitions: repetitions,
        description: description,
        show_reps: show_reps,
      })
      .eq("id", skill_id);

    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
};
