import client from "~/utils/supabaseClient";
import getUserId from "../userManagement/getUserId";
import { SessionWithOrder } from "~/utils/types";

export default async (session_id: number, name: string, order: number) => {
  const user_id = getUserId();

  try {
    const { data, error } = await client
      .from("sessions")
      .update({ name })
      .eq("id", session_id)
      .eq("user_id", user_id)
      .select();
    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error("No data returned from updateSession");
    }

    const { error: sessions_of_groupsError } = await client
      .from("sessions_of_groups")
      .update({ order })
      .eq("session_id", session_id)
      .eq("user_id", user_id);

    if (sessions_of_groupsError) throw sessions_of_groupsError;

    return data[0] as SessionWithOrder;
  } catch (error) {
    throw error;
  }
};
