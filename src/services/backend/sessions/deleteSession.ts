import client from "~/utils/supabaseClient";
import getUserId from "../userManagement/getUserId";
import deleteMultipleStations from "../stations/deleteMultipleStations";
import { PostgrestMaybeSingleResponse } from "@supabase/supabase-js";

export default async (session_id: number) => {
  try {
    const user_id = getUserId();
    if (!user_id) {
      throw new Error("No user_id found");
    }

    const {
      data: stations,
      error: getStationsError,
    }: PostgrestMaybeSingleResponse<{ station_id: number }[]> = await client
      .from("stations_of_sessions")
      .select("station_id")
      .eq("session_id", session_id);

    if (getStationsError) {
      throw getStationsError;
    }

    if (!stations) {
      throw new Error("No stations found");
    }

    const stationIds = stations.map((station) => station.station_id);

    await deleteMultipleStations(stationIds);

    const { error: deleteSessionError } = await client
      .from("sessions")
      .delete()
      .eq("id", session_id)
      .eq("user_id", user_id);

    if (deleteSessionError) {
      throw deleteSessionError;
    }

    return;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
