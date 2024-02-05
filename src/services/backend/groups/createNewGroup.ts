import client from "~/utils/supabaseClient";
import getUserId from "../userManagement/getUserId";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { GroupFromDB } from "~/utils/types";

export default async (name: string, lastOrder: number) => {
  try {
    const user_id = getUserId();

    if (!user_id) throw new Error("User not found");

    const { data, error }: PostgrestSingleResponse<GroupFromDB[]> = await client
      .from("groups")
      .insert([{ name, user_id, order: lastOrder + 1 }])
      .select();

    if (error) throw error;

    if (!data) throw new Error("Group not created");

    return data[0];
  } catch (error) {
    throw error;
  }
};
