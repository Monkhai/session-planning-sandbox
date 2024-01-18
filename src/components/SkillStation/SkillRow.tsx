import { queryClient } from "Providers/ReactQueryProvider";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { IoMdRemoveCircle } from "react-icons/io";
import {
  IoCloseCircleSharp,
  IoInformationCircleOutline,
} from "react-icons/io5";
import { FetchContext } from "~/context/FetchContext";
import useDeleteSkill from "~/hooks/useDeleteSkill";
import useUpdateSkill from "~/hooks/useUpdateSkill";
import { SkillType } from "~/utils/types";
import SkillStationDescriptionModal from "./SkillStationDescriptionModal";

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

  const { fetchStatus } = useContext(FetchContext);

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

  const handleDeleteSkill = () => {
    deleteSkill({ id: skill.id, station_id: skill.station_id });
  };

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
      });
    },
    [skill, skillName, reps, description, showReps],
  );

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
          disabled={fetchStatus === "fetching"}
          ref={nameRef}
          value={skillName}
          onChange={(e) => setSkillName(e.target.value)}
          className="h-[24px] flex-1 text-xl outline-none active:outline-none print:text-xs"
          placeholder={"Skill Name"}
        />
        {showReps && (
          <input
            disabled={fetchStatus === "fetching"}
            ref={repsRef}
            value={reps ? reps : ""}
            onChange={(e) => setReps(Number(e.target.value))}
            className="h-[24px] text-right text-xl outline-none active:outline-none print:text-sm"
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
        <SkillStationDescriptionModal
          handleToggleReps={handleToggleReps}
          showReps={showReps}
          description={description}
          descriptionRef={descriptionRef}
          setDescription={setDescription}
          setShowInfo={setShowInfo}
          showInfo={showInfo}
          setShowReps={setShowReps}
        />
      </div>
    </div>
  );
};

export default React.memo(SkillRow);
