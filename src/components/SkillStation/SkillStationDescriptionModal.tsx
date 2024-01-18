import React, { useEffect } from "react";
import { IoCloseCircleSharp } from "react-icons/io5";

interface Props {
  showInfo: boolean;
  setShowInfo: React.Dispatch<React.SetStateAction<boolean>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  descriptionRef: React.RefObject<HTMLTextAreaElement>;
  showReps: boolean;
  handleToggleReps: (show: boolean) => void;
}
const SkillStationDescriptionModal = ({
  description,
  descriptionRef,
  setDescription,
  setShowInfo,
  showInfo,
  showReps,
  handleToggleReps,
}: Props) => {
  useEffect(() => {
    if (descriptionRef.current) {
      descriptionRef.current.style.height = "0"; // Reset height to shrink if text is deleted
      descriptionRef.current.style.height =
        descriptionRef.current.scrollHeight + "px";
    }
  }, [description]);
  return (
    <div
      className="absolute left-10 top-5 w-80"
      style={{
        transition: "all 0.150s ease-in-out",
        scale: showInfo ? 1 : 0,
        opacity: showInfo ? 1 : 0,
        transformOrigin: "0px 10px",
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
            checked={showReps}
            onChange={(e) => handleToggleReps(e.target.checked)}
            type="checkbox"
            name="showReps"
            id="showReps"
            className="h-4 w-4"
          />
        </div>
      </div>
    </div>
  );
};

export default React.memo(SkillStationDescriptionModal);
