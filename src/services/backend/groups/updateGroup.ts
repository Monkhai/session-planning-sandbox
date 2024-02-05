import client from "~/utils/supabaseClient";
import getUserId from "../userManagement/getUserId";
import { GroupFromDB, SessionFromDB } from "~/utils/types";
import { PostgrestSingleResponse } from "@supabase/supabase-js";

export default async (group_id: number, name: string) => {
  const user_id = getUserId();

  try {
    const { data, error }: PostgrestSingleResponse<GroupFromDB[]> = await client
      .from("groups")
      .update({ name })
      .eq("id", group_id)
      .eq("user_id", user_id)
      .select();
    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error("No data returned from groups");
    }

    return data[0];
  } catch (error) {
    throw error;
  }
};
