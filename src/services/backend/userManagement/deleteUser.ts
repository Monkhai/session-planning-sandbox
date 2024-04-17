import client from "~/utils/supabaseClient";
import getUserId from "./getUserId";
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const BUCKET_NAME = "user-media";

export const deleteAllUserMedia = async () => {
  try {
    const user_id = getUserId();
    if (!user_id) throw new Error("User not found");

    const { data, error } = await client.storage
      .from(BUCKET_NAME)
      .list(`${user_id}/drills`);

    if (error) throw error;

    console.log(data);

    for (const drill of data) {
      const { data: drillData, error: drillError } = await client.storage
        .from(BUCKET_NAME)
        .list(`${user_id}/drills/${drill.name}`);

      if (drillError) throw drillError;

      console.log(drillData, "drillData");

      if (drillData.length > 0) {
        drillData.forEach(async (media) => {
          const { data: mediaData, error: mediaError } = await client.storage
            .from(BUCKET_NAME)
            .remove([`${user_id}/drills/${drill.name}/${media.name}`]);

          if (mediaError) throw mediaError;

          console.log(mediaData, "mediaData");
        });
      }

      const { error: removeError } = await client.storage
        .from(BUCKET_NAME)
        .remove([`${user_id}/drills/${drill.name}`]);
    }

    await client.storage.from(BUCKET_NAME).remove([`${user_id}/drills`]);
    await client.storage.from(BUCKET_NAME).remove([`${user_id}`]);
  } catch (error) {
    console.error(error);
  }
};

export default async () => {
  try {
    const user_id = getUserId();
    if (!user_id) throw new Error("User not found");

    await deleteAllUserMedia();

    const { data, error } = await client.rpc("delete_user", { user_id });
    if (error) throw error;
  } catch (error) {
    console.error(error);
  }
};
