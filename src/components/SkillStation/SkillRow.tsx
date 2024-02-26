import React, { useCallback, useState } from "react";
import { IoInformationCircleOutline } from "react-icons/io5";
import useDeleteSkill from "~/hooks/skillStationHooks/useDeleteSkill";
import useSkillRowStates from "~/hooks/skillStationHooks/useSkillRowStates";
import useUpdateSkill from "~/hooks/skillStationHooks/useUpdateSkill";
import { SkillType } from "~/utils/types";
import RemoveIcon from "../icons/RemoveIcon";
import SkillStationDescriptionModal from "./SkillStationDescriptionModal";
import { Reorder, useDragControls } from "framer-motion";
import ReorderController from "../ReorderController";

interface Props {
  isLast?: boolean;
  skill: SkillType;
  editSkills?: boolean;
  index: number;
  onReorderEnd: () => void;
}

const SkillRow = ({
  isLast,
  skill,
  editSkills,
  index,
  onReorderEnd,
}: Props) => {
  const [showInfo, setShowInfo] = useState<boolean>(false);

  const nameRef = React.useRef<HTMLInputElement>(null);
  const repsRef = React.useRef<HTMLInputElement>(null);
  const descriptionRef = React.useRef<HTMLTextAreaElement>(null);

  const controlButtonRef = React.useRef<HTMLButtonElement>(null);

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
        order: skill.order,
      });
    },
    [skill, skillName, reps, description, showReps],
  );
  const dragContols = useDragControls();
  return (
    <Reorder.Item
      dragControls={dragContols}
      dragListener={false}
      value={skill}
      className="flex flex-row gap-2 md:gap-0"
    >
      <div
        style={{
          borderBottomLeftRadius: isLast ? "10px" : "0px",
          borderBottomRightRadius: isLast ? "10px" : "0px",
          borderTopLeftRadius: index == 0 ? "10px" : "0px",
          borderTopRightRadius: index == 0 ? "10px" : "0px",
        }}
        className={
          !isLast
            ? "-0 flex h-[36px] w-full flex-row items-center border-b-[1px] border-b-seperator bg-white print:h-[35px] print:border-none md:h-[50px] dark:bg-darkSecondaryBackground"
            : "flex h-[36px] w-full flex-row items-center bg-white print:h-[35px] md:h-[50px] dark:bg-darkSecondaryBackground"
        }
      >
        <ReorderController
          controls={dragContols}
          handleReorderEnd={onReorderEnd}
        />
        <div className="flex w-full flex-row items-center p-4">
          <input
            ref={nameRef}
            value={skillName}
            onChange={(e) => setSkillName(e.target.value)}
            className="h-[24px] flex-[3] text-base outline-none placeholder:text-base active:outline-none print:text-xs md:text-xl md:placeholder:text-xl dark:bg-transparent"
            placeholder={"Skill name"}
          />
          {showReps && (
            <div className="flex flex-row items-center gap-2">
              <input
                ref={repsRef}
                value={reps ? reps : ""}
                onChange={(e) => setReps(Number(e.target.value))}
                className="h-[24px] flex-1 text-right text-base outline-none placeholder:text-base active:outline-none print:text-xs md:text-xl md:placeholder:text-xl dark:bg-transparent"
                placeholder="Reps"
              />
              {reps ? <p className="text-base md:text-xl">reps</p> : null}
            </div>
          )}
          {editSkills && (
            <button
              className="ml-2 transition-all duration-150 active:scale-95 print:hidden md:ml-4"
              onClick={handleDeleteSkill}
            >
              <RemoveIcon size={20} />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center print:hidden md:relative md:left-4">
        <button
          ref={controlButtonRef}
          onClick={() => setShowInfo(!showInfo)}
          style={{
            rotate: showInfo ? "22.5deg" : "0deg",
            transition: "all 0.300s cubic-bezier(0, 0, 0.58, 1.0)",
          }}
          className="rounded-full active:scale-95"
        >
          <IoInformationCircleOutline color={"var(--color-blue)"} size={28} />
        </button>

        <SkillStationDescriptionModal
          controlButtonRef={controlButtonRef}
          handleToggleReps={handleToggleReps}
          showReps={showReps}
          description={description}
          descriptionRef={descriptionRef}
          setDescription={setDescription}
          setShowInfo={setShowInfo}
          showInfo={showInfo}
        />
      </div>
    </Reorder.Item>
  );
};
export default SkillRow;
