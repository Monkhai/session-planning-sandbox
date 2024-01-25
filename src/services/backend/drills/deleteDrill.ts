import { PostgrestSingleResponse } from "@supabase/supabase-js";
import client from "~/utils/supabaseClient";
import { DrillFromDBType } from "~/utils/types";

export default async (drill_id: number) => {
  try {
    const { data, error }: PostgrestSingleResponse<DrillFromDBType[]> =
      await client.from("drills").delete().eq("id", drill_id).select();

    if (error) {
      throw error;
    }
    return data[0];
  } catch (error) {
    throw error;
  }
};
