import client from "~/utils/supabaseClient";
import { GroupFromDB } from "~/utils/types";

export default async (group: GroupFromDB) => {
  try {
    const { data, error } = await client
      .from("groups")
      .update({ order: group.order - 1 })
      .eq("id", group.id)
      .select();

    if (error) {
      console.error(error);
      throw error;
    }

    if (!data) {
      console.error("No data");
      throw new Error("No data");
    }

    return data[0] as GroupFromDB;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
