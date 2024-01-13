import React, { useEffect, useState } from "react";
import { IoMdRemoveCircle } from "react-icons/io";
import {
  IoCloseCircleSharp,
  IoInformationCircleOutline,
} from "react-icons/io5";
import useDeleteSkill from "~/hooks/useDeleteSkill";
import useUpdateSkill from "~/hooks/useUpdateSkill";
import { SkillType } from "~/utils/types";

interface Props {
  isLast?: boolean;
  skill: SkillType;
  editSkills?: boolean;
  index: number;
}

const SkillRow = ({ isLast, skill, editSkills, index }: Props) => {
  const [skillName, setSkillName] = useState<string>("");
  const [reps, setReps] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [showReps, setShowReps] = useState<boolean>(false);

  const nameRef = React.useRef<HTMLInputElement>(null);
  const repsRef = React.useRef<HTMLInputElement>(null);
  const descriptionRef = React.useRef<HTMLTextAreaElement>(null);

  const { mutate: deleteSkill } = useDeleteSkill();
  const { mutate: updateSkill } = useUpdateSkill();

  useEffect(() => {
    setSkillName(skill.name);
    setReps(skill.repetitions);
    setDescription(skill.description);
  }, [skill]);

  useEffect(() => {
    const handleBlur = () => {
      if (
        skillName !== skill.name ||
        reps !== skill.repetitions ||
        description !== skill.description
      ) {
        updateSkill({
          skill_id: skill.id,
          name: skillName,
          repetitions: reps,
          description: description,
          station_id: skill.station_id,
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
  }, [skill, skillName, reps, description]);

  const handleDeleteSkill = () => {
    deleteSkill({ id: skill.id, station_id: skill.station_id });
  };

  return (
    <div className="flex flex-row">
      <div
        style={{
          borderBottomLeftRadius: isLast ? "10px" : "0px",
          borderBottomRightRadius: isLast ? "10px" : "0px",
          borderTopLeftRadius: index == 0 ? "10px" : "0px",
          borderTopRightRadius: index == 0 ? "10px" : "0px",
        }}
        className={
          !isLast
            ? "flex h-[50px] w-full flex-row border-b-[1px] border-b-seperator bg-white p-4 print:h-[35px] print:border-none  print:p-2 print:py-0"
            : "flex h-[50px] w-full flex-row  bg-white p-4 print:h-[35px]  print:p-2 print:py-0"
        }
      >
        <input
          ref={nameRef}
          value={skillName}
          onChange={(e) => setSkillName(e.target.value)}
          className="h-[20px] flex-1 text-xl outline-none active:outline-none print:text-xs"
          placeholder="Skill Name"
        />
        {showReps && (
          <input
            ref={repsRef}
            value={reps ? reps : ""}
            onChange={(e) => setReps(Number(e.target.value))}
            className="h-[20px] text-right text-xl outline-none active:outline-none print:text-sm"
            placeholder="Reps"
          />
        )}
        {editSkills && (
          <button
            className="ml-4 transition-all duration-150 active:scale-95 print:hidden"
            onClick={handleDeleteSkill}
          >
            <IoMdRemoveCircle color={"red"} size={24} />
          </button>
        )}
      </div>
      <div className="relative left-4 flex items-center justify-center print:hidden">
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="transition-all duration-150 active:scale-95 "
        >
          <IoInformationCircleOutline color={"var(--color-blue)"} size={28} />
        </button>
        {/* description modal */}
        <div
          className="absolute left-10 w-80"
          style={{
            transition: "all 0.150s ease-in-out",
            scale: showInfo ? 1 : 0,
            opacity: showInfo ? 1 : 0,
            transformOrigin: "left",
          }}
        >
          <div className="z-10 flex w-80 flex-col gap-4 rounded-[10px] bg-white p-4 shadow-xl">
            <div className="flex flex-row ">
              <h3 className="flex-1 font-semibold">Description</h3>
              <button onClick={() => setShowInfo(false)}>
                <IoCloseCircleSharp size={24} color={"var(--color-blue)"} />
              </button>
            </div>
            <textarea
              ref={descriptionRef}
              value={description ? description : ""}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter skill description"
              style={{ resize: "none" }}
              className="h-24 w-full outline-none active:outline-none"
              name="description"
              id="description"
            />

            <div className="flex flex-row pr-1">
              <p className="flex-1 ">Show reps</p>
              <input
                onChange={(e) => setShowReps(e.target.checked)}
                type="checkbox"
                name="showReps"
                id="showReps"
                className="h-4 w-4"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(SkillRow);
