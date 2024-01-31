import client from "~/utils/supabaseClient";
import deleteMultipleDrills from "../drills/deleteMultipleDrills";
import deleteMultipleSkills from "../skills/deleteMultipleSkills";
import deleteMultipleStations from "../stations/deleteMultipleStations";
import getListOfDrills from "../stations/drillStations/getListOfDrills";
import getListOfSkills from "../stations/skillStations/getListOfSkills";
import getUserId from "../userManagement/getUserId";
import getListOfStations from "./getListOfStations";

export default async (session_id: number) => {
  try {
    const user_id = getUserId();
    if (!user_id) {
      throw new Error("No user_id found");
    }

    const stations = await getListOfStations(session_id);

    const skillStationIds = stations.skillStationIds.map(
      (station) => station.id,
    );
    const drillStationIds = stations.drillStationIds.map(
      (station) => station.id,
    );

    const drill_ids = await getListOfDrills(drillStationIds);
    const skill_ids = await getListOfSkills(skillStationIds);

    await deleteMultipleDrills(drill_ids);
    await deleteMultipleSkills(skill_ids);

    const station_ids = [...skillStationIds, ...drillStationIds];

    await deleteMultipleStations(station_ids);

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
