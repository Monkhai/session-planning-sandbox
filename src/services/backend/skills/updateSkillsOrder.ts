import { SkillType } from "~/utils/types";
import updateSkill from "./updateSkill";

export default async (skills: SkillType[]) => {
  try {
    const updatedSkills = Promise.all(
      skills.map(async (skill, index) => {
        const newSkill = await updateSkill({
          description: skill.description,
          name: skill.name,
          order: index + 1,
          repetitions: skill.repetitions,
          show_reps: skill.show_reps,
          skill_id: skill.id,
          skillOfStationId: skill.skillOfStationId,
        });
        if (!newSkill) {
          throw new Error("No data returned from skills");
        }

        return newSkill;
      }),
    );

    return updatedSkills;
  } catch (error) {
    throw error;
  }
};
