import client from "~/utils/supabaseClient";
import getUserId from "../userManagement/getUserId";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { AthleteFromDB } from "~/utils/types";

export default async (group_id: number) => {
  try {
    const user_id = getUserId();

    if (!user_id) throw new Error("User not found");

    const { data, error }: PostgrestSingleResponse<{ athlete_id: number }[]> =
      await client
        .from("athletes_of_groups")
        .select("athlete_id")
        .eq("group_id", group_id);

    if (error) throw error;
    if (!data) throw new Error("No data");

    const athlete_ids = data.map((athlete) => athlete.athlete_id);

    const {
      data: athletes,
      error: athletesError,
    }: PostgrestSingleResponse<AthleteFromDB[]> = await client
      .from("athletes")
      .select()
      .in("id", athlete_ids);

    if (athletesError) throw athletesError;

    if (!athletes) throw new Error("No athletes");

    return athletes;
  } catch (error) {
    throw error;
  }
};
