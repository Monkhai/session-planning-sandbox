import client from "~/utils/supabaseClient";
import getUserId from "../../userManagement/getUserId";
import deleteMedia from "./deleteMedia";
import getAllMediaForDrill from "./getAllMediaForDrill";

export default async (station_id: number) => {
  const user_id = getUserId();
  if (!user_id) {
    console.error("User not found");
    return;
  }

  try {
    const allMedia = await getAllMediaForDrill(station_id);
    if (allMedia.length > 0) {
      allMedia.forEach(async (media) => {
        await deleteMedia(media.name, station_id);
      });
    }

    const { error } = await client.storage
      .from("user-media")
      .remove([`${user_id}/drills/${station_id}`]);

    if (error) {
      console.error(error);
    }
  } catch (error) {
    throw error;
  }
};
