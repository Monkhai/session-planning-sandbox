import client from "~/utils/supabaseClient";
import getUserId from "../userManagement/getUserId";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { AthleteFromDB } from "~/utils/types";

export default async (group_id: number, name: string, lastOrder: number) => {
  try {
    const user_id = getUserId();

    if (!user_id) throw new Error("User not found");

    //create new athelte
    const {
      data: athlete,
      error: athleteError,
    }: PostgrestSingleResponse<AthleteFromDB[]> = await client
      .from("athletes")
      .insert([{ user_id, name, order: lastOrder + 1 }])
      .select();

    if (athleteError) throw athleteError;

    if (!athlete) throw new Error("No data");
    if (athlete.length === 0) throw new Error("No data");
    if (!athlete[0]) throw new Error("No data");

    const athlete_id = athlete[0].id;

    const { error: athletes_of_groupsError } = await client
      .from("athletes_of_groups")
      .insert([{ group_id, athlete_id, user_id }]);

    if (athletes_of_groupsError) throw athletes_of_groupsError;

    return athlete[0];
  } catch (error) {
    throw error;
  }
};
