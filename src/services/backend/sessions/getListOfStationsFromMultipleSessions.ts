import client from "~/utils/supabaseClient";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import getUserId from "../userManagement/getUserId";
import { StationType } from "~/utils/types";

export default async (session_ids: number[]) => {
  try {
    const user_id = getUserId();

    if (!user_id) {
      throw new Error("User not logged in");
    }

    const { data, error }: PostgrestSingleResponse<{ station_id: number }[]> =
      await client
        .from("stations_of_sessions")
        .select("station_id")
        .in("session_id", session_ids);

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error("No data");
    }

    const station_ids = data.map((station) => station.station_id);

    const {
      data: stations,
      error: stationsError,
    }: PostgrestSingleResponse<{ id: number; type: StationType }[]> =
      await client.from("stations").select("id, type").in("id", station_ids);

    if (stationsError) {
      throw stationsError;
    }

    if (!stations) {
      throw new Error("No stations");
    }

    const drillStationIds = stations.filter(
      (station) => station.type === "drillStation",
    );
    const skillStationIds = stations.filter(
      (station) => station.type === "skillStation",
    );

    return {
      drillStationIds,
      skillStationIds,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
