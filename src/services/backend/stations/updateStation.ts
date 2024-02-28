import { PostgrestSingleResponse } from "@supabase/supabase-js";
import client from "~/utils/supabaseClient";
import { StationFromDB } from "~/utils/types";
type Args = {
  station_id: number;
  duration: string | null;
  name: string;
  show_duration: boolean;
  order: number;
};

export default async ({
  station_id,
  duration,
  name,
  show_duration,
  order,
}: Args) => {
  try {
    const { data, error }: PostgrestSingleResponse<StationFromDB[]> =
      await client
        .from("stations")
        .update({
          duration: duration,
          name: name,
          show_duration: show_duration,
        })
        .eq("id", station_id)
        .select();

    if (error) {
      throw error;
    }

    const { error: stationOfSessionError } = await client
      .from("stations_of_sessions")
      .update({ order })
      .eq("station_id", station_id);

    if (stationOfSessionError) {
      throw stationOfSessionError;
    }

    if (!data) {
      throw new Error("No data returned from updateStation");
    }

    if (data[0] === undefined) {
      throw new Error("No data returned from updateStation");
    }

    return data[0];
  } catch (error) {
    throw error;
  }
};
