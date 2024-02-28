import { PostgrestSingleResponse } from "@supabase/supabase-js";
import client from "~/utils/supabaseClient";
import { DrillFromDBType, DrillType } from "~/utils/types";
type Args = {
  drill_id: number;
  duration: string | null;
  name: string;
  show_duration: boolean;
  description: string;
  comments: string;
  show_comments: boolean;
  show_media: boolean;
  show_edit_media: boolean;
  station_id: number;
  session_id: string;
  order: number;
  drillOfStationId: number;
};
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
  order,
  drillOfStationId,
}: Args) => {
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
    const { error: updateOrderError } = await client
      .from("drills_of_drill_stations")
      .update({ order })
      .eq("drill_id", drill_id);

    if (updateOrderError) {
      throw updateOrderError;
    }

    if (!data) {
      throw new Error("No data");
    }

    if (!data[0]) {
      throw new Error("No data");
    }

    return {
      ...data[0],
      order,
      drillOfStationId,
    } as DrillType;
  } catch (error) {
    throw error;
  }
};
