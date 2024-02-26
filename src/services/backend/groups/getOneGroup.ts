import { PostgrestSingleResponse } from "@supabase/supabase-js";
import client from "~/utils/supabaseClient";
import { GroupFromDB } from "~/utils/types";
import getUserId from "../userManagement/getUserId";

export default async (group_id: number) => {
  try {
    const user_id = getUserId();

    if (!user_id) throw new Error("User not logged in");

    const { data, error }: PostgrestSingleResponse<GroupFromDB[]> = await client
      .from("groups")
      .select("*")
      .eq("id", group_id)
      .eq("user_id", user_id);

    if (error) throw error;

    if (!data) throw new Error("No data returned from getOneGroup");

    if (!data[0]) throw new Error("No group found with that id");

    return data[0];
  } catch (error) {
    throw error;
  }
};
