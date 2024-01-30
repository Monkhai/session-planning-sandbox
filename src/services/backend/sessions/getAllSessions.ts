import client from "~/utils/supabaseClient";
import getUserId from "../userManagement/getUserId";

export default async () => {
  const user_id = getUserId();
  if (!user_id) {
    return null;
  }

  try {
    const { data, error } = await client
      .from("sessions")
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
  }
};
