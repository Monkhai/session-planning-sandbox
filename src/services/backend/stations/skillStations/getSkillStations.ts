import { PostgrestSingleResponse } from "@supabase/supabase-js";
import client from "~/utils/supabaseClient";
import {
  SkillFromDBType,
  SkillList,
  SkillStationType,
  SkillStationWithSkillsType,
} from "~/utils/types";
import getUserId from "../../userManagement/getUserId";

const getSkillStations = async (
  user_id: string,
): Promise<SkillStationType[]> => {
  const {
    data: stations,
    error: stationsError,
  }: PostgrestSingleResponse<SkillStationType[]> = await client
    .from("skill_stations")
    .select(
      `
          id,
          name,
          duration,
          order,
          user_id,
          show_duration,
          type
        `,
    )
    .order("order", { ascending: true })
    .eq("user_id", user_id);

  if (stationsError) {
    throw stationsError;
  }

  return stations;
};

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

export default async (): Promise<SkillStationWithSkillsType[]> => {
  const user_id = getUserId();
  if (!user_id) {
    console.error("User not found");
    return [];
  }

  try {
    const stations: SkillStationType[] = await getSkillStations(user_id);

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
