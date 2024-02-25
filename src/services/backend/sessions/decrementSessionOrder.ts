import client from "~/utils/supabaseClient";
import { SessionWithOrder } from "~/utils/types";

export default async (session: SessionWithOrder) => {
  try {
    const { data, error } = await client
      .from("sessions")
      .update({ order: session.order - 1 })
      .eq("id", session.id)
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
