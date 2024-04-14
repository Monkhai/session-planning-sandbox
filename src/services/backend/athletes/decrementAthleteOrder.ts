import client from "~/utils/supabaseClient";
import { AthleteWithOrder } from "~/utils/types";

export default async (athlete: AthleteWithOrder) => {
  try {
    const { data, error } = await client
      .from("athletes_of_group")
      .update({ order: athlete.order - 1 })
      .eq("athlete_id", athlete.id)
      .select();

    if (error) {
      console.error(error);
      throw error;
    }

    if (!data) {
      console.error("No data");
      throw new Error("No data");
    }

    return data[0] as AthleteWithOrder;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
