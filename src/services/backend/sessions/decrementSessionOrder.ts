import client from "~/utils/supabaseClient";
import { SessionWithOrder } from "~/utils/types";

type TableType = "sessions_of_athletes" | "sessions_of_groups";

export default async (session: SessionWithOrder, table: TableType) => {
  try {
    const { data, error } = await client
      .from(table)
      .update({ order: session.order - 1 })
      .eq("session_id", session.id)
      .select();

    if (error) {
      console.error(error);
      throw error;
    }

    if (!data) {
      console.error("No data");
      throw new Error("No data");
    }

    return data[0] as SessionWithOrder;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
