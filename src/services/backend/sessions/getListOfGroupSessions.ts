import { PostgrestSingleResponse } from "@supabase/supabase-js";
import client from "~/utils/supabaseClient";
import { SessionFromDB, SessionWithOrder } from "~/utils/types";
import getUserId from "../userManagement/getUserId";

export default async (group_id: number) => {
  try {
    const user_id = getUserId();

    if (!user_id) throw new Error("User not found");

    const {
      data,
      error,
    }: PostgrestSingleResponse<{ session_id: number; order: number }[]> =
      await client
        .from("sessions_of_groups")
        .select("session_id, order")
        .eq("group_id", group_id)
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

    const orderedSessions: SessionWithOrder[] = data.map((sessionOfGroup) => {
      const session = sessions.find(
        (session) => session.id === sessionOfGroup.session_id,
      );

      if (!session) throw new Error("No session");

      return {
        ...session,
        order: sessionOfGroup.order,
      } as SessionWithOrder;
    });

    if (!orderedSessions) throw new Error("No sessions");

    return orderedSessions;
  } catch (error) {
    throw error;
  }
};
