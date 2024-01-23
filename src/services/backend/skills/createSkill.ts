import { PostgrestSingleResponse } from "@supabase/supabase-js";
import client from "~/utils/supabaseClient";
import { SkillFromDBType, SkillType, SkillofSKillStation } from "~/utils/types";
import getUserId from "../userManagement/getUserId";

export default async (station_id: number, lastOrder: number) => {
  const user_id = getUserId();
  if (!user_id) {
    console.error("User not found");
    return null;
  }
  try {
    const { data: skill, error }: PostgrestSingleResponse<SkillFromDBType[]> =
      await client
        .from("skills")
        .insert([
          {
            name: "",
            user_id: user_id,
          },
        ])
        .select();

    if (error) {
      throw error;
    }

    if (!skill || skill.length < 1 || skill[0] === undefined) {
      throw new Error("No skill");
    }

    const {
      data: skillOfSkillStation,
      error: skillOfSkillStationError,
    }: PostgrestSingleResponse<SkillofSKillStation[]> = await client
      .from("skills_of_skill_stations")
      .insert([
        {
          user_id: user_id,
          skill_id: skill[0].id,
          skill_station_id: station_id,
          order: lastOrder + 1,
        },
      ])
      .select();

    if (error || skillOfSkillStationError) {
      throw error;
    }

    if (skillOfSkillStation === undefined || skillOfSkillStation.length < 1) {
      throw new Error("No skill of skill station");
    }

    const skillWithOrder = {
      ...skill[0],
      order: skillOfSkillStation[0]!.order,
      station_id: station_id,
      description: skill[0].description,
      id: skill[0].id,
      name: skill[0].name,
      repetitions: skill[0].repetitions,
      show_reps: skill[0].show_reps,
      skillOfStationId: skillOfSkillStation[0]!.id,
    } as SkillType;

    return skillWithOrder as SkillType;
  } catch (error) {
    throw error;
  }
};
