import client from "~/utils/supabaseClient";
import getUserId from "../userManagement/getUserId";
import { SessionWithOrder } from "~/utils/types";

type Args = {
  session_id: number;
  name: string;
  order: number;
  joinTable: "sessions_of_groups" | "sessions_of_athletes";
};

export default async ({ session_id, name, order, joinTable }: Args) => {
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

    const { error: sessionsOfError } = await client
      .from(joinTable)
      .update({ order })
      .eq("session_id", session_id)
      .eq("user_id", user_id);

    if (sessionsOfError) throw sessionsOfError;

    const sessionWithOrder = {
      ...data[0],
      order,
    };

    return sessionWithOrder as SessionWithOrder;
  } catch (error) {
    throw error;
  }
};
