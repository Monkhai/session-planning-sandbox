import { PostgrestSingleResponse } from "@supabase/supabase-js";
import client from "~/utils/supabaseClient";
import { AthleteFromDB, AthleteWithOrder } from "~/utils/types";
import getUserId from "../userManagement/getUserId";

export default async (group_id: number) => {
  try {
    const user_id = getUserId();

    if (!user_id) throw new Error("User not found");

    const {
      data,
      error,
    }: PostgrestSingleResponse<{ athlete_id: number; order: number }[]> =
      await client
        .from("athletes_of_groups")
        .select("athlete_id, order")
        .eq("group_id", group_id)
        .order("order", { ascending: true });

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

    //reorder athletes to match the order in the athletes_of_groups table
    const orderedAthletes = data.map((athleteFromDB) => {
      const athlete = athletes.find(
        (athlete) => athlete.id === athleteFromDB.athlete_id,
      );

      if (!athlete) throw new Error("No athlete");

      return {
        ...athlete,
        order: athleteFromDB.order,
      } as AthleteWithOrder;
    });

    if (!orderedAthletes) throw new Error("No athletes");

    return orderedAthletes;
  } catch (error) {
    throw error;
  }
};
