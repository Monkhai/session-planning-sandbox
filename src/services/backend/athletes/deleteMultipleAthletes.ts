import client from "~/utils/supabaseClient";

export default async (athlete_ids: number[]) => {
  try {
    const { error: deleteAthletesError } = await client
      .from("athletes")
      .delete()
      .in("id", athlete_ids);

    if (deleteAthletesError) throw deleteAthletesError;

    return;
  } catch (error) {
    throw error;
  }
};
