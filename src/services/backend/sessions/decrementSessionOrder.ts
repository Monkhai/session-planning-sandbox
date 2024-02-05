import client from "~/utils/supabaseClient";
import { SessionFromDB } from "~/utils/types";

export default async (session: SessionFromDB) => {
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

    return data[0] as SessionFromDB;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
