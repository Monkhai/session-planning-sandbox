import client from "~/utils/supabaseClient";
import getUserId from "../userManagement/getUserId";

export default async (name: string, lastOrder: number) => {
  const user_id = getUserId();

  if (!user_id) {
    return null;
  }

  try {
    const { data, error } = await client
      .from("sessions")
      .insert([{ name: name, user_id: user_id, order: lastOrder + 1 }])
      .select();

    if (error) {
      console.error(error);
      throw error;
    }

    if (!data) {
      console.error("No data");
      throw new Error("No data");
    }

    return data[0];
  } catch (error) {
    console.error(error);
  }
};
