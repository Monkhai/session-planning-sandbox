import React, { useEffect, useState } from "react";
import { IoMdRemoveCircle } from "react-icons/io";
import useDeleteSkill from "~/hooks/useDeleteSkill";
import { Skill } from "~/utils/types";

interface Props {
  isLast?: boolean;
  skill: Skill;
  isPendingDelete: boolean;
}

const SkillRow = ({ isLast, skill, isPendingDelete }: Props) => {
  const [skillName, setSkillName] = useState<string>("");
  const [reps, setReps] = useState<number>(0);

  useEffect(() => {
    setSkillName(skill.name);
    setReps(skill.repetitions);
  }, [skill]);

  const { mutate: deleteSkill } = useDeleteSkill();

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
        value={skillName}
        onChange={(e) => setSkillName(e.target.value)}
        className="flex-1 text-xl outline-none active:outline-none"
        placeholder="Skill Name"
      />
      <input
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
