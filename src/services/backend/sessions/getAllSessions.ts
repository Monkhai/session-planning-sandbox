import client from "~/utils/supabaseClient";
import getUserId from "../userManagement/getUserId";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { SessionFromDB } from "~/utils/types";

export default async () => {
  const user_id = getUserId();
  if (!user_id) {
    return undefined;
  }

  try {
    const { data, error }: PostgrestSingleResponse<SessionFromDB[]> =
      await client
        .from("sessions")
        .select("*")
        .eq("user_id", user_id)
        .order("order", { ascending: true });

    if (error) {
      console.error(error);
      throw error;
    }

    if (!data) {
      console.error("No data");
      throw new Error("No data");
    }

    return data;
  } catch (error) {
    console.error(error);
    throw error;
    // return undefined;
  }
};
