import { UseMutateFunction } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SkillType, updateSkillArgs } from "~/utils/types";

type useSkillRowStatesArgs = {
  skill: SkillType;
  updateSkill: UseMutateFunction<void, Error, updateSkillArgs, () => void>;
  nameRef: React.RefObject<HTMLInputElement | null>;
  repsRef: React.RefObject<HTMLInputElement | null>;
  descriptionRef: React.RefObject<HTMLTextAreaElement | null>;
};

const useSkillRowStates = ({
  descriptionRef,
  nameRef,
  repsRef,
  skill,
  updateSkill,
}: useSkillRowStatesArgs) => {
  const [skillName, setSkillName] = useState<string>("");
  const [reps, setReps] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [showReps, setShowReps] = useState<boolean>(false);

  const params = useParams<{ id: string }>();

  useEffect(() => {
    setSkillName(skill.name);
    setReps(skill.repetitions);
    setDescription(skill.description);
    setShowReps(skill.show_reps);
  }, [skill]);

  useEffect(() => {
    const handleBlur = () => {
      if (
        skillName !== skill.name ||
        reps !== skill.repetitions ||
        description !== skill.description ||
        showReps !== skill.show_reps
      ) {
        updateSkill({
          skill_id: skill.id,
          name: skillName,
          repetitions: reps,
          description: description,
          station_id: skill.station_id,
          show_reps: showReps,
          session_id: params.id,
        });
      }
    };

    const nameElement = nameRef.current;
    if (nameElement) {
      nameElement.addEventListener("blur", handleBlur);
    }

    const repsElement = repsRef.current;
    if (repsElement) {
      repsElement.addEventListener("blur", handleBlur);
    }

    const descriptionElement = descriptionRef.current;
    if (descriptionElement) {
      descriptionElement.addEventListener("blur", handleBlur);
    }

    return () => {
      if (nameElement) {
        nameElement.removeEventListener("blur", handleBlur);
      }
      if (repsElement) {
        repsElement.removeEventListener("blur", handleBlur);
      }
      if (descriptionElement) {
        descriptionElement.removeEventListener("blur", handleBlur);
      }
    };
  }, [skill, skillName, reps, description, showReps]);

  return {
    skillName,
    setSkillName,
    reps,
    setReps,
    description,
    setDescription,
    showReps,
    setShowReps,
    session_id: params.id,
  };
};

export default useSkillRowStates;
