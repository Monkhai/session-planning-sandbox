import { PostgrestSingleResponse } from "@supabase/supabase-js";
import client from "~/utils/supabaseClient";
import { AthleteFromDB, AthleteWithOrder } from "~/utils/types";
import getUserId from "../userManagement/getUserId";

export default async (athlete_id: number, name: string, order: number) => {
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

    if (!data || data[0] === undefined) {
      throw new Error("No data returned from athletes");
    }

    const { error: athletes_of_groupsError } = await client
      .from("athletes_of_groups")
      .update({ order })
      .eq("athlete_id", athlete_id)
      .eq("user_id", user_id);

    if (athletes_of_groupsError) {
      throw athletes_of_groupsError;
    }

    const athleteWithOrder: AthleteWithOrder = {
      ...data[0],
      order,
    };

    return athleteWithOrder;
  } catch (error) {
    throw error;
  }
};
