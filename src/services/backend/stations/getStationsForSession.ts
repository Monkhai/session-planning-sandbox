import { PostgrestSingleResponse } from "@supabase/supabase-js";
import client from "~/utils/supabaseClient";
import {
  DrillFromDBType,
  DrillList,
  DrillStationType,
  DrillStationWithDrillsType,
  DrillType,
  SkillFromDBType,
  SkillList,
  SkillStationType,
  SkillStationWithSkillsType,
  Station,
  StationFromDB,
} from "~/utils/types";
import getUserId from "../userManagement/getUserId";

const getDrillList = async (stations: DrillStationType[]) => {
  return Promise.all(
    stations.map(async (station) => {
      const {
        data: drills,
        error: drillsError,
      }: PostgrestSingleResponse<
        { id: number; drill_id: number; order: number }[]
      > = await client
        .from("drills_of_drill_stations")
        .select(`id, drill_id, order`)
        .eq("drill_station_id", station.id);

      if (drillsError) {
        throw drillsError;
      }

      return { station_id: station.id, drillList: drills };
    }),
  );
};

//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------

const getDrillidIds = async (
  station: DrillStationType,
  drillList: DrillList[],
) => {
  const drillIds: number[] =
    drillList
      .find((drill) => drill.station_id === station.id)
      ?.drillList.map((drill) => drill.drill_id) ?? [];

  return drillIds;
};

//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------

const getDrills = async (drillIds: number[]) => {
  const {
    data: drills,
    error: drillsError,
  }: PostgrestSingleResponse<DrillFromDBType[]> = await client
    .from("drills")
    .select(
      `
            id,
            name,
            duration,
            show_duration,
            description,
            comments,
            show_comments,
            show_media,
            show_edit_media
            `,
    )
    .in("id", drillIds);

  if (drillsError) {
    throw drillsError;
  }

  return drills;
};

//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------

const insertOrderToDrills = (
  drills: DrillFromDBType[],
  station: DrillStationType,
  drillList: DrillList[],
): DrillType[] => {
  return drills.map((drill) => {
    const order: number =
      drillList
        .find((drillList) => drillList.station_id === station.id)
        ?.drillList.find((drillList) => drillList.drill_id === drill.id)
        ?.order ?? 0;

    const drillOfDrillStationId: number | undefined = drillList
      .find((drillList) => drillList.station_id === station.id)
      ?.drillList.find((drillList) => drillList.drill_id === drill.id)?.id;

    if (!drillOfDrillStationId || drillOfDrillStationId === undefined) {
      throw new Error("Can't find drill of drill station id");
    }

    return {
      ...drill,
      order: order,
      station_id: station.id,
      drillOfStationId: drillOfDrillStationId,
      user_id: station.user_id,
    } as DrillType;
  });
};

//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------

const getDrillStations = async (
  stations: DrillStationType[],
): Promise<DrillStationWithDrillsType[]> => {
  const user_id = getUserId();
  if (!user_id) {
    console.error("User not found");
    return [];
  }

  try {
    if (stations.length < 1) {
      return [];
    }

    const drillList = await getDrillList(stations);

    const stationsWithDrills: DrillStationWithDrillsType[] = await Promise.all(
      stations.map(async (station) => {
        const drillIds: number[] = await getDrillidIds(station, drillList);

        if (!drillIds || drillIds.length < 1) {
          return {
            ...station,
            drills: [],
          };
        }

        const drills = await getDrills(drillIds);

        const drillsWithOrder: DrillType[] = insertOrderToDrills(
          drills,
          station,
          drillList,
        );

        const sortedDrills = drillsWithOrder.sort((a, b) => a.order - b.order);

        const stationWithDrills = {
          ...station,
          drills: sortedDrills,
        };
        return stationWithDrills as DrillStationWithDrillsType;
      }),
    );

    return stationsWithDrills as DrillStationWithDrillsType[];
  } catch (error) {
    console.error(error);
    return [];
  }
};

//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------

const getSkillList = async (stations: SkillStationType[]) => {
  const skillList = Promise.all(
    stations.map(async (station) => {
      const {
        data: skills,
        error: skillsError,
      }: PostgrestSingleResponse<
        { id: number; skill_id: number; order: number }[]
      > = await client
        .from("skills_of_skill_stations")
        .select(`id, skill_id, order`)
        .eq("skill_station_id", station.id);

      if (skillsError) {
        throw skillsError;
      }

      return { station_id: station.id, skillList: skills };
    }),
  );
  return skillList;
};

const getSkillIds = (skillList: SkillList[], station: SkillStationType) => {
  const skillIds: number[] =
    skillList
      .find((skill) => skill.station_id === station.id)
      ?.skillList.map((skill) => skill.skill_id) ?? [];

  return skillIds;
};

const getSkills = async (skillIds: number[]) => {
  const {
    data: skills,
    error: skillsError,
  }: PostgrestSingleResponse<SkillFromDBType[]> = await client
    .from("skills")
    .select(`id, name, repetitions, description, show_reps`)
    .in("id", skillIds);

  if (skillsError) {
    throw skillsError;
  }

  return skills;
};

const insertOrderToSkills = (
  skills: SkillFromDBType[],
  station: SkillStationType,
  skillList: SkillList[],
) => {
  return skills.map((skill) => {
    const order: number =
      skillList
        .find((skillList) => skillList.station_id === station.id)
        ?.skillList.find((skillList) => skillList.skill_id === skill.id)
        ?.order ?? 0;

    const skillOfSkillStationId: number | undefined = skillList
      .find((skillList) => skillList.station_id === station.id)
      ?.skillList.find((skillList) => skillList.skill_id === skill.id)?.id;

    if (!skillOfSkillStationId || skillOfSkillStationId === undefined) {
      throw new Error("Can't find skill of skill station id");
    }

    return {
      ...skill,
      order: order,
      station_id: station.id,
      skillOfStationId: skillOfSkillStationId,
    };
  });
};

const getStationsWithSkills = async (
  stations: SkillStationType[],
  skillList: SkillList[],
) => {
  return Promise.all(
    stations.map(async (station) => {
      const skillIds: number[] = getSkillIds(skillList, station);

      if (!skillIds || skillIds.length < 1) {
        return {
          ...station,
          skills: [],
        };
      }

      const skills = await getSkills(skillIds);

      const skillsWithOrder = insertOrderToSkills(skills, station, skillList);

      const sortedSkills = skillsWithOrder.sort((a, b) => a.order - b.order);

      const stationWithSkills = {
        ...station,
        skills: sortedSkills,
      };

      return stationWithSkills as SkillStationWithSkillsType;
    }),
  );
};

const getSkillStations = async (
  stations: SkillStationType[],
): Promise<SkillStationWithSkillsType[]> => {
  const user_id = getUserId();
  if (!user_id) {
    console.error("User not found");
    return [];
  }

  try {
    if (stations.length < 1) {
      return [];
    }

    const skillList = await getSkillList(stations);

    const stationsWithSkills = await getStationsWithSkills(stations, skillList);

    return stationsWithSkills;
  } catch (error) {
    throw error;
  }
};

const getStationList = async (session_id: number, user_id: string) => {
  const {
    data: stations,
    error,
  }: PostgrestSingleResponse<{ id: number; station_id: number }[]> =
    await client
      .from("stations_of_sessions")
      .select("id, station_id")
      .eq("user_id", user_id)
      .eq("session_id", session_id);

  if (error) {
    console.error(error);
    throw error;
  }

  if (!stations) {
    console.error("No data");
    throw new Error("No data");
  }

  return stations;
};

//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------

const getStations = async (
  stationList: { id: number; station_id: number }[],
) => {
  const { data: stations, error }: PostgrestSingleResponse<StationFromDB[]> =
    await client
      .from("stations")
      .select("*")
      .in(
        "id",
        stationList.map((station) => station.station_id),
      );
  if (error) {
    throw error;
  }

  if (!stations) {
    throw new Error("No data");
  }

  return stations;
};

//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------
export default async (session_id: string) => {
  const user_id = getUserId();
  if (!user_id) {
    throw new Error("No user id");
  }

  try {
    const stationList = await getStationList(Number(session_id), user_id);

    const stations = await getStations(stationList);

    const drillStations = stations.filter(
      (station) => station.type === "drillStation",
    ) as DrillStationType[];
    const skillStations = stations.filter(
      (station) => station.type === "skillStation",
    ) as SkillStationType[];

    const drillStationsWithDrills = await getDrillStations(drillStations);
    const skillStationsWithSkills = await getSkillStations(skillStations);

    const allStations = [
      ...drillStationsWithDrills,
      ...skillStationsWithSkills,
    ];
    allStations.sort((a, b) => a.order - b.order);

    return allStations as Station[];
  } catch (error) {
    console.error(error);
    throw error;
  }
};
