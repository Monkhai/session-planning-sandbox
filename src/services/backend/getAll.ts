import { PostgrestSingleResponse } from "@supabase/supabase-js";
import getUserId from "./userManagement/getUserId";
import client from "~/utils/supabaseClient";

export default async <T>(table: string) => {
  const user_id = getUserId();
  if (!user_id) {
    return undefined;
  }

  try {
    const { data, error }: PostgrestSingleResponse<T[]> = await client
      .from(table)
      .select("*")
      .eq("user_id", user_id)
      .order("order", { ascending: true });

    if (error) {
      console.error(error);
      throw error;
    }

    if (!data) {
      console.error("No data");
      throw new Error("No data");
    }

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
