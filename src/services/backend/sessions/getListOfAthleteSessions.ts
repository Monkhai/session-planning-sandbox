import client from "~/utils/supabaseClient";
import getUserId from "../userManagement/getUserId";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { SessionFromDB, SessionWithOrder } from "~/utils/types";

export default async (athlete_id: number) => {
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
        .eq("athlete_id", athlete_id)
        .order("order", { ascending: true });

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

    const sessionsWithOrder: SessionWithOrder[] = sessions.map((session) => {
      const order = data.find((s) => s.session_id === session.id)?.order;

      if (order === undefined) throw new Error("No order");

      return { ...session, order };
    });

    return sessionsWithOrder.sort((a, b) => a.order - b.order);
  } catch (error) {
    throw error;
  }
};
