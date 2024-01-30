import React, { useCallback, useState } from "react";
import { IoMdRemoveCircle } from "react-icons/io";
import { IoInformationCircleOutline } from "react-icons/io5";
import useDeleteSkill from "~/hooks/skillStationHooks/useDeleteSkill";
import useSkillRowStates from "~/hooks/skillStationHooks/useSkillRowStates";
import useUpdateSkill from "~/hooks/skillStationHooks/useUpdateSkill";
import { SkillType } from "~/utils/types";
import SkillStationDescriptionModal from "./SkillStationDescriptionModal";

interface Props {
  isLast?: boolean;
  skill: SkillType;
  editSkills?: boolean;
  index: number;
}

const SkillRow = ({ isLast, skill, editSkills, index }: Props) => {
  const [showInfo, setShowInfo] = useState<boolean>(false);

  const nameRef = React.useRef<HTMLInputElement>(null);
  const repsRef = React.useRef<HTMLInputElement>(null);
  const descriptionRef = React.useRef<HTMLTextAreaElement>(null);

  const { mutate: deleteSkill } = useDeleteSkill();
  const { mutate: updateSkill } = useUpdateSkill();

  const {
    description,
    reps,
    skillName,
    showReps,
    setSkillName,
    setReps,
    setDescription,
    setShowReps,
    session_id,
  } = useSkillRowStates({
    skill: skill,
    descriptionRef: descriptionRef,
    nameRef: nameRef,
    repsRef: repsRef,
    updateSkill: updateSkill,
  });

  const handleDeleteSkill = useCallback(() => {
    deleteSkill({
      id: skill.id,
      station_id: skill.station_id,
      session_id: session_id,
    });
  }, [skill.id, skill.station_id]);

  const handleToggleReps = useCallback(
    (show: boolean) => {
      setShowReps(show);
      updateSkill({
        skill_id: skill.id,
        name: skillName,
        repetitions: reps,
        description: description,
        station_id: skill.station_id,
        show_reps: show,
        session_id: session_id,
      });
    },
    [skill, skillName, reps, description, showReps],
  );

  return (
    <div className="flex flex-row gap-2 md:gap-0">
      <div
        style={{
          borderBottomLeftRadius: isLast ? "10px" : "0px",
          borderBottomRightRadius: isLast ? "10px" : "0px",
          borderTopLeftRadius: index == 0 ? "10px" : "0px",
          borderTopRightRadius: index == 0 ? "10px" : "0px",
        }}
        className={
          !isLast
            ? "flex h-[36px] w-full flex-row items-center border-b-[1px] border-b-seperator bg-white p-2 print:h-[35px] print:border-none print:p-2 print:py-0 md:h-[50px]  md:p-4 dark:bg-darkSecondaryBackground"
            : "flex h-[36px] w-full flex-row items-center  bg-white  p-2 print:h-[35px] print:p-2 print:py-0 md:h-[50px] md:p-4  dark:bg-darkSecondaryBackground"
        }
      >
        <input
          ref={nameRef}
          value={skillName}
          onChange={(e) => setSkillName(e.target.value)}
          className="h-[24px] flex-[3] text-base outline-none placeholder:text-base active:outline-none print:text-xs md:text-xl md:placeholder:text-xl dark:bg-transparent"
          placeholder={"Skill name"}
        />
        {showReps && (
          <input
            ref={repsRef}
            value={reps ? reps : ""}
            onChange={(e) => setReps(Number(e.target.value))}
            className="h-[24px] flex-1 text-right text-base outline-none placeholder:text-base active:outline-none print:text-xs md:text-xl md:placeholder:text-xl dark:bg-transparent"
            // className="h-[24px] flex-1 text-right text-xl outline-none active:outline-none print:text-sm dark:bg-transparent"
            placeholder="Reps"
          />
        )}
        {editSkills && (
          <button
            className="ml-2 transition-all duration-150 active:scale-95 print:hidden md:ml-4"
            onClick={handleDeleteSkill}
          >
            <IoMdRemoveCircle
              color={"red"}
              className="h-4 w-4 md:h-[24px] md:w-[24px]"
            />
          </button>
        )}
      </div>

      <div className="flex items-center justify-center print:hidden md:relative md:left-4">
        <button
          onClick={() => setShowInfo(!showInfo)}
          style={{
            rotate: showInfo ? "22.5deg" : "0deg",
            transition: "all 0.300s cubic-bezier(0, 0, 0.58, 1.0)",
          }}
          className="rounded-full  active:scale-95"
        >
          <IoInformationCircleOutline color={"var(--color-blue)"} size={28} />
        </button>

        <SkillStationDescriptionModal
          handleToggleReps={handleToggleReps}
          showReps={showReps}
          description={description}
          descriptionRef={descriptionRef}
          setDescription={setDescription}
          setShowInfo={setShowInfo}
          showInfo={showInfo}
        />
      </div>
    </div>
  );
};
export default SkillRow;
