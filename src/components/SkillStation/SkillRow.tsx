import {
  AnimatePresence,
  Reorder,
  checkTargetForNewValues,
  motion,
  spring,
  useDragControls,
} from "framer-motion";
import React, { useCallback, useEffect, useState } from "react";
import { IoInformationCircleOutline } from "react-icons/io5";
import useDeleteSkill from "~/hooks/skillStationHooks/useDeleteSkill";
import useSkillRowStates from "~/hooks/skillStationHooks/useSkillRowStates";
import { SkillType } from "~/utils/types";
import ReorderController from "../ReorderController";
import RemoveIcon from "../icons/RemoveIcon";
import SkillStationDescriptionModal from "./SkillStationDescriptionModal";

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
    updateSkill,
  } = useSkillRowStates({
    skill: skill,
    descriptionRef: descriptionRef,
    nameRef: nameRef,
    repsRef: repsRef,
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
        skillOfStationId: skill.skillOfStationId,
      });
    },
    [skill, skillName, reps, description, showReps],
  );
  const dragContols = useDragControls();

  const [points, setPoints] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const [showContext, setShowContext] = useState(false);
  const contextMenueRef = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (showContext) {
      document.addEventListener("mousedown", (e) => {
        const target = e.target as HTMLElement;
        const context = contextMenueRef.current;

        if (context && !context.contains(target)) {
          setShowContext(false);
        }
      });
    }
  });

  return (
    <Reorder.Item
      dragControls={dragContols}
      dragListener={false}
      value={skill}
      onDragEnd={onReorderEnd}
      className="flex flex-row gap-2 md:gap-0"
    >
      <div
        onContextMenu={(e) => {
          e.preventDefault();
          setPoints({ x: e.pageX, y: e.pageY });
          setShowContext(true);
        }}
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
        <ReorderController controls={dragContols} />
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
        <AnimatePresence>
          {showContext && (
            <motion.div
              layout
              // transition={spring}
              key={skill.id}
              initial={{ scale: 0, opacity: 0, transformOrigin: "top left" }}
              animate={{ scale: 1, opacity: 1, transformOrigin: "top left" }}
              exit={{ scale: 0, opacity: 0, transformOrigin: "top left" }}
              ref={contextMenueRef}
              style={{
                position: "absolute",
                top: points.y,
                left: points.x,
                zIndex: 100 + index,
              }}
              className="flex w-80 flex-col gap-4 rounded-md border-2 border-seperator bg-white p-4 shadow-lg dark:border-darkSeperator dark:bg-darkSecondaryBackground"
            >
              <div className="flex flex-row pr-1">
                <p className="flex-1 ">Show reps</p>
                <input
                  checked={showReps}
                  onChange={(e) => handleToggleReps(e.target.checked)}
                  type="checkbox"
                  name="showReps"
                  id="showReps"
                  className="h-4 w-4"
                />
              </div>
              <button
                onClick={() => {
                  setShowContext(false);
                  handleDeleteSkill();
                }}
                className="outline-6 flex h-12 w-full items-center justify-center rounded-md bg-red-500 text-white "
              >
                Delete
              </button>
            </motion.div>
          )}
        </AnimatePresence>
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
          <IoInformationCircleOutline
            color={description ? "var(--color-blue)" : "gray"}
            size={28}
          />
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
