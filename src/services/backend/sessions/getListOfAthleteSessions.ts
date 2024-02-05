import client from "~/utils/supabaseClient";
import getUserId from "../userManagement/getUserId";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { SessionFromDB } from "~/utils/types";

export default async (athlete_id: number) => {
  try {
    const user_id = getUserId();

    if (!user_id) throw new Error("User not found");

    const { data, error }: PostgrestSingleResponse<{ session_id: number }[]> =
      await client
        .from("sessions_of_athletes")
        .select("session_id")
        .eq("athlete_id", athlete_id);

    if (error) throw error;

    if (!data) throw new Error("No data");

    const session_ids = data.map((session) => session.session_id);

    const {
      data: sessions,
      error: sessionsError,
    }: PostgrestSingleResponse<SessionFromDB[]> = await client
      .from("sessions")
      .select()
      .in("id", session_ids);

    if (sessionsError) throw sessionsError;

    if (!sessions) throw new Error("No sessions");

    return sessions;
  } catch (error) {
    throw error;
  }
};
