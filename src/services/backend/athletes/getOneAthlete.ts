import client from "~/utils/supabaseClient";
import getUserId from "../userManagement/getUserId";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { AthleteFromDB } from "~/utils/types";

export default async (athlete_id: number) => {
  try {
    const user_id = getUserId();

    if (!user_id) throw new Error("User not logged in");

    const { data, error }: PostgrestSingleResponse<AthleteFromDB[]> =
      await client
        .from("athletes")
        .select("*")
        .eq("id", athlete_id)
        .eq("user_id", user_id);

    if (error) throw error;

    if (!data) throw new Error("No data returned from getAthleteName");

    if (!data[0]) throw new Error("No athlete found with that id");

    return data[0];
  } catch (error) {
    throw error;
  }
};
