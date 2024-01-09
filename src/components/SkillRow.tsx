import React, { useEffect, useState } from "react";
import { IoMdRemoveCircle } from "react-icons/io";
import useDeleteSkill from "~/hooks/useDeleteSkill";
import useUpdateSkill from "~/hooks/useUpdateSkill";
import { Skill } from "~/utils/types";

interface Props {
  isLast?: boolean;
  skill: Skill;
  isPendingDelete: boolean;
}

const SkillRow = ({ isLast, skill, isPendingDelete }: Props) => {
  const [skillName, setSkillName] = useState<string>("");
  const [reps, setReps] = useState<number>(0);
  const nameRef = React.useRef<HTMLInputElement>(null);
  const repsRef = React.useRef<HTMLInputElement>(null);
  const { mutate: deleteSkill } = useDeleteSkill();
  const { mutate: updateSkill } = useUpdateSkill();
  useEffect(() => {
    setSkillName(skill.name);
    setReps(skill.repetitions);
  }, [skill]);

  useEffect(() => {
    const handleBlur = () => {
      if (skillName !== skill.name || reps !== skill.repetitions) {
        updateSkill({ skill_id: skill.id, name: skillName, repetitions: reps });
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

    return () => {
      if (nameElement) {
        nameElement.removeEventListener("blur", handleBlur);
      }
      if (repsElement) {
        repsElement.removeEventListener("blur", handleBlur);
      }
    };
  }, [skill, skillName, reps]);

  const handleDeleteSkill = () => {
    deleteSkill(skill.id);
  };

  return (
    <div
      style={{
        borderBottom: !isLast ? "0.5px solid var(--color-seperator)" : "none",
      }}
      className="flex w-full  bg-white p-4"
    >
      <input
        ref={nameRef}
        value={skillName}
        onChange={(e) => setSkillName(e.target.value)}
        className="flex-1 text-xl outline-none active:outline-none"
        placeholder="Skill Name"
      />
      <input
        ref={repsRef}
        value={reps ? reps : ""}
        onChange={(e) => setReps(Number(e.target.value))}
        className="text-right text-xl outline-none active:outline-none"
        placeholder="Reps"
      />
      <button
        className="ml-4 transition-all duration-150 active:scale-95"
        onClick={handleDeleteSkill}
        disabled={isPendingDelete}
      >
        <IoMdRemoveCircle color={isPendingDelete ? "gray" : "red"} size={24} />
      </button>
    </div>
  );
};

export default SkillRow;
