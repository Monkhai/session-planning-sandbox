import client from "~/utils/supabaseClient";
import { SkillType } from "~/utils/types";
import getUserId from "../userManagement/getUserId";

type Args = {
  skill_id: number;
  name: string;
  repetitions: number;
  description: string;
  show_reps: boolean;
  order: number;
};

export default async ({
  skill_id,
  name,
  repetitions,
  description,
  show_reps,
  order,
}: Args) => {
  try {
    const user_id = getUserId();

    if (!user_id) throw new Error("No user id");

    const { data, error } = await client
      .from("skills")
      .update({
        name: name,
        repetitions: repetitions,
        description: description,
        show_reps: show_reps,
      })
      .eq("id", skill_id)
      .select();

    if (error) {
      throw error;
    }

    const { error: updateOrderError } = await client
      .from("skills_of_skill_stations")
      .update({ order })
      .eq("skill_id", skill_id)
      .eq("user_id", user_id);

    if (updateOrderError) {
      throw updateOrderError;
    }

    if (!data) {
      throw new Error("No data");
    }

    if (!data[0]) {
      throw new Error("No data");
    }

    const skillWithOrder = {
      ...data[0],
      order,
    };

    return skillWithOrder as SkillType;
  } catch (error) {
    throw error;
  }
};
