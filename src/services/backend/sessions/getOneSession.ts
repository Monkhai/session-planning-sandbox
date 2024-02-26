import { PostgrestSingleResponse } from "@supabase/supabase-js";
import client from "~/utils/supabaseClient";
import { SessionFromDB } from "~/utils/types";
import getUserId from "../userManagement/getUserId";

export default async (session_id: number) => {
  try {
    const user_id = getUserId();

    if (!user_id) throw new Error("User not logged in");

    const { data, error }: PostgrestSingleResponse<SessionFromDB[]> =
      await client
        .from("sessions")
        .select("*")
        .eq("id", session_id)
        .eq("user_id", user_id);

    if (error) throw error;

    if (!data) throw new Error("No data returned from getOneSession");

    if (!data[0]) throw new Error("No session found with that id");

    return data[0];
  } catch (error) {
    throw error;
  }
};
