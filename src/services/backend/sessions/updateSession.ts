import client from "~/utils/supabaseClient";
import getUserId from "../userManagement/getUserId";
import { SessionFromDB } from "~/utils/types";

export default async (session_id: number, name: string) => {
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

    return data[0] as SessionFromDB;
  } catch (error) {
    throw error;
  }
};
