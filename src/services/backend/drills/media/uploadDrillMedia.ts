import client from "~/utils/supabaseClient";
import getUserId from "../../userManagement/getUserId";

export default async (station_id: number, file: File) => {
  const user_id = getUserId();
  if (!user_id) {
    console.error("User not found");
    return;
  }

  const fileName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");

  try {
    const { error } = await client.storage
      .from("user-media")
      .upload(`${user_id}/drills/${station_id}/${fileName}`, file);

    if (error) {
      console.error(error);
      throw error;
    }
  } catch (error) {
    console.error(error);
    return;
  }
};
