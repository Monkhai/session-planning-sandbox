import client from "~/utils/supabaseClient";
import { SkillType } from "~/utils/types";

export default async (skill: SkillType) => {
  try {
    const { data, error } = await client
      .from("skills_of_skill_stations")
      .update({ order: skill.order - 1 })
      .eq("id", skill.skillOfStationId)
      .select();

    if (error) {
      console.error(error);
      throw error;
    }

    if (!data) {
      console.error("No data");
      throw new Error("No data");
    }

    return data[0] as SkillType;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
