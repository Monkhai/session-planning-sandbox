import client from "~/utils/supabaseClient";
import getUserId from "../userManagement/getUserId";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { SessionWithOrder } from "~/utils/types";

export default async (name: string, lastOrder: number, athlete_id: number) => {
  try {
    const user_id = getUserId();

    if (!user_id) throw new Error("User not logged in");

    const { data, error }: PostgrestSingleResponse<SessionWithOrder[]> =
      await client
        .from("sessions")
        .insert([{ name: name, user_id: user_id }])
        .select();

    if (error) throw error;

    if (!data) throw new Error("No data (create new athlete session)");

    if (!data[0]) throw new Error("No data (create new athlete session)");

    const session_id = data[0].id;

    const { error: groupSessionError } = await client
      .from("sessions_of_athletes")
      .insert([{ athlete_id, session_id, user_id, order: lastOrder + 1 }]);

    if (groupSessionError) throw groupSessionError;

    return data[0];
  } catch (error) {
    console.error(error);
  }
};
