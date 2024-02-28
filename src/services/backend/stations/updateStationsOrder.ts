import client from "~/utils/supabaseClient";
import {
  DrillFromDBType,
  DrillType,
  SkillFromDBType,
  SkillList,
  SkillType,
  Station,
} from "~/utils/types";
import updateStation from "./updateStation";
import { PostgrestSingleResponse } from "@supabase/supabase-js";

const getSkillList = async (id: number) => {
  const {
    data: skills,
    error: skillsError,
  }: PostgrestSingleResponse<
    { id: number; skill_id: number; order: number }[]
  > = await client
    .from("skills_of_skill_stations")
    .select(`id, skill_id, order`)
    .eq("skill_station_id", id);

  if (skillsError) {
    throw skillsError;
  }

  return skills;
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
  skillList: { id: number; skill_id: number; order: number }[],
  station_id: number,
) => {
  return skills.map((skill) => {
    const order = skillList.find((skillItem) => skillItem.skill_id === skill.id)
      ?.order;
    const skillOfStationId = skillList.find(
      (skillItem) => skillItem.skill_id === skill.id,
    )?.id;
    if (!order) {
      throw new Error("No order found for skill");
    }

    return {
      ...skill,
      order,
      station_id,
      skillOfStationId,
    } as SkillType;
  });
};
//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------
const getDrillList = async (id: number) => {
  const {
    data: drills,
    error: drillsError,
  }: PostgrestSingleResponse<
    { id: number; drill_id: number; order: number }[]
  > = await client
    .from("drills_of_drill_stations")
    .select(`id, drill_id, order`)
    .eq("drill_station_id", id);

  if (drillsError) {
    throw drillsError;
  }

  return drills;
};

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

const insertOrderToDrills = (
  drills: DrillFromDBType[],
  drillList: {
    id: number;
    drill_id: number;
    order: number;
  }[],
  station_id: number,
) => {
  return drills.map((drill) => {
    const order = drillList.find((drillItem) => drillItem.drill_id === drill.id)
      ?.order;
    const drillOfStationId = drillList.find(
      (drillItem) => drillItem.drill_id === drill.id,
    )?.id;

    if (!order) {
      throw new Error("No order found for drill");
    }

    return {
      ...drill,
      order,
      station_id,
      drillOfStationId,
    } as DrillType;
  });
};
//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------
export default async (stations: Station[]) => {
  try {
    const updatedStations = Promise.all(
      stations.map(async (station, index) => {
        if (station.order !== index + 1) {
          const newStation = await updateStation({
            duration: station.duration,
            name: station.name,
            show_duration: station.show_duration,
            station_id: station.id,
            order: index + 1,
          });

          if (!newStation) {
            throw new Error("No data returned from stations");
          }

          if (newStation.type === "skillStation") {
            const skillList = await getSkillList(newStation.id);

            const skillIds = skillList.map((skill) => skill.skill_id);

            const skills = await getSkills(skillIds);

            const orderedSkills = insertOrderToSkills(
              skills,
              skillList,
              newStation.id,
            );

            orderedSkills.sort((a, b) => a.order - b.order);

            return {
              ...newStation,
              skills: orderedSkills,
            };
          } else {
            const drillList = await getDrillList(newStation.id);

            const drillIds = drillList.map((drill) => drill.drill_id);

            const drills = await getDrills(drillIds);

            const orderedDrills = insertOrderToDrills(
              drills,
              drillList,
              newStation.id,
            );

            orderedDrills.sort((a, b) => a.order - b.order);

            return {
              ...newStation,
              drills: orderedDrills,
            };
          }
        }

        return station;
      }),
    );

    return updatedStations;
  } catch (error) {
    throw error;
  }
};
