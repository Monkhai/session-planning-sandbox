import { PostgrestSingleResponse } from "@supabase/supabase-js";
import client from "~/utils/supabaseClient";
import { AthleteFromDB } from "~/utils/types";
import getUserId from "../userManagement/getUserId";

export default async (athlete_id: number, name: string) => {
  const user_id = getUserId();

  try {
    const { data, error }: PostgrestSingleResponse<AthleteFromDB[]> =
      await client
        .from("athletes")
        .update({ name })
        .eq("id", athlete_id)
        .eq("user_id", user_id)
        .select();
    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error("No data returned from athletes");
    }

    return data[0];
  } catch (error) {
    throw error;
  }
};
