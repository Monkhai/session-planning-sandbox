import client from "~/utils/supabaseClient";
import getUserId from "../userManagement/getUserId";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { SessionFromDB, SessionWithOrder } from "~/utils/types";

export default async (athlete_ids: number[]) => {
  try {
    const user_id = getUserId();

    if (!user_id) throw new Error("User not found");

    const {
      data,
      error,
    }: PostgrestSingleResponse<{ session_id: number; order: number }[]> =
      await client
        .from("sessions_of_athletes")
        .select("session_id, order")
        .in("athlete_id", athlete_ids);

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

    const orderedSessions = sessions.map((session) => {
      const order = data.find((s) => s.session_id === session.id)?.order;

      if (!session) throw new Error("No session");

      return {
        ...session,
        order,
      } as SessionWithOrder;
    });

    if (!orderedSessions) throw new Error("No sessions");

    return orderedSessions;
  } catch (error) {
    throw error;
  }
};
