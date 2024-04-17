import client from "~/utils/supabaseClient";
import getUserId from "../../userManagement/getUserId";

export default async (name: string, station_id: number) => {
  const user_id = getUserId();
  if (!user_id) {
    console.error("User not found");
    return;
  }

  try {
    const { data, error } = await client.storage
      .from("user-media")
      .remove([`${user_id}/drills/${station_id}/${name}`]);

    if (error) throw error;
  } catch (error) {
    throw error;
  }
};
