import { PostgrestSingleResponse } from "@supabase/supabase-js";
import client from "~/utils/supabaseClient";
import { DrillFromDBType, UpdateDrillArgs } from "~/utils/types";

export default async ({
  drill_id,
  name,
  duration,
  show_duration,
  description,
  comments,
  show_comments,
  show_media,
  show_edit_media,
}: UpdateDrillArgs) => {
  try {
    const { data, error }: PostgrestSingleResponse<DrillFromDBType[]> =
      await client
        .from("drills")
        .update({
          name: name,
          duration: duration,
          show_duration: show_duration,
          description,
          comments: comments,
          show_comments: show_comments,
          show_media: show_media,
          show_edit_media: show_edit_media,
        })
        .eq("id", drill_id)
        .select();

    if (error) {
      throw error;
    }
    return data[0];
  } catch (error) {
    throw error;
  }
};
