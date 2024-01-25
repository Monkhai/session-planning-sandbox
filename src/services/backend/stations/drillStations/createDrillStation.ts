import client from "~/utils/supabaseClient";
import { DrillStationType } from "~/utils/types";
import getUserId from "../../userManagement/getUserId";

export default async (lastOrder: number) => {
  const user_id = getUserId();
  if (!user_id) {
    console.error("User not found");
    return [];
  }

  try {
    const { data, error } = await client
      .from("drill_stations")
      .insert([{ name: "", user_id: user_id, order: lastOrder + 1 }])
      .select();

    if (error) {
      throw error;
    }
    return data as DrillStationType[];
  } catch (error) {
    console.error(error);
    return [];
  }
};
