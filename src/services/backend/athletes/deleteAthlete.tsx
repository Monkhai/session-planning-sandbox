import client from "~/utils/supabaseClient";
import deleteSessionsOfAthlete from "../sessions/deleteSessionsOfAthlete";
import getUserId from "../userManagement/getUserId";

export default async (athlete_id: number) => {
  try {
    const user_id = getUserId();

    if (!user_id) throw new Error("User not found");

    await deleteSessionsOfAthlete(athlete_id);

    const { error: deleteAthleteError } = await client
      .from("athletes")
      .delete()
      .eq("id", athlete_id)
      .eq("user_id", user_id);

    if (deleteAthleteError) throw deleteAthleteError;
    return;
  } catch (error) {
    throw error;
  }
};
