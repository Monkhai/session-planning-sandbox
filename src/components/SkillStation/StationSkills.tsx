import { FaCirclePlus } from "react-icons/fa6";
import { SkillStationType } from "~/utils/types";
import SkillRow from "./SkillRow";
import React from "react";

interface Props {
  station: SkillStationType;
  onCreateSkill: () => void;
  editSkills: boolean;
}

const StationSkills = ({ editSkills, onCreateSkill, station }: Props) => {
  return (
    <div className="flex w-1/2 flex-col">
      {station.skills &&
        station.skills.map((skill, index) => (
          <SkillRow
            index={index}
            skill={skill}
            editSkills={editSkills}
            key={skill.id}
            isLast={station.skills.length - 1 == index}
          />
        ))}
      <button
        onClick={onCreateSkill}
        className="my-4 self-center transition-all duration-150 active:scale-95 print:hidden"
      >
        <FaCirclePlus color={"var(--color-blue)"} size={30} />
      </button>
    </div>
  );
};

export default StationSkills;
