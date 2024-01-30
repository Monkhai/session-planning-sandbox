import { FaCirclePlus } from "react-icons/fa6";
import { SkillStationWithSkillsType } from "~/utils/types";
import SkillRow from "./SkillRow";

interface Props {
  station: SkillStationWithSkillsType;
  onCreateSkill: () => void;
  editSkills: boolean;
}

const StationSkills = ({ editSkills, onCreateSkill, station }: Props) => {
  return (
    <div className="flex w-full flex-col  md:w-1/2 ">
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
