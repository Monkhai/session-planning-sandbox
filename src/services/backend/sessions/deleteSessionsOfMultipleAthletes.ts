import client from "~/utils/supabaseClient";
import deleteMultipleDrills from "../drills/deleteMultipleDrills";
import deleteMultipleSkills from "../skills/deleteMultipleSkills";
import deleteMultipleStations from "../stations/deleteMultipleStations";
import getListOfDrills from "../stations/drillStations/getListOfDrills";
import getListOfSkills from "../stations/skillStations/getListOfSkills";
import getUserId from "../userManagement/getUserId";
import getListOfMultipleAthletesSessions from "./getListOfMultipleAthletesSessions";
import getListOfStationsFromMultipleSessions from "./getListOfStationsFromMultipleSessions";

type Args = {
  athlete_ids: number[];
};

export default async ({ athlete_ids }: Args) => {
  try {
    const user_id = getUserId();

    const athleteSessions =
      await getListOfMultipleAthletesSessions(athlete_ids);

    const session_ids = athleteSessions.map((session) => session.id);

    const stations = await getListOfStationsFromMultipleSessions(session_ids);

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
      .in("id", session_ids)
      .eq("user_id", user_id);

    if (deleteSessionError) throw deleteSessionError;

    return;
  } catch (error) {
    throw error;
  }
};
