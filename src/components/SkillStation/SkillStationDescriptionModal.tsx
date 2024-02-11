import React, { useEffect } from "react";
import useModalControl from "~/hooks/useModalControl";
import CloseIcon from "../icons/CloseIcon";

interface Props {
  showInfo: boolean;
  setShowInfo: React.Dispatch<React.SetStateAction<boolean>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  descriptionRef: React.RefObject<HTMLTextAreaElement>;
  showReps: boolean;
  handleToggleReps: (show: boolean) => void;
  controlButtonRef: React.RefObject<HTMLButtonElement>;
}
const SkillStationDescriptionModal = ({
  description,
  descriptionRef,
  setDescription,
  setShowInfo,
  showInfo,
  showReps,
  handleToggleReps,
  controlButtonRef,
}: Props) => {
  const ref = React.useRef<HTMLDivElement>(null);
  useModalControl(ref, showInfo, setShowInfo, controlButtonRef);

  useEffect(() => {
    if (descriptionRef.current) {
      descriptionRef.current.style.height = "0"; // Reset height to shrink if text is deleted
      descriptionRef.current.style.height =
        descriptionRef.current.scrollHeight + "px";
    }
  }, [description]);
  return (
    <div
      ref={ref}
      className="absolute left-10 top-5 z-10 w-80 origin-smallSize md:origin-midSize"
      style={{
        transition: "all 0.150s ease-in-out",
        scale: showInfo ? 1 : 0,
        opacity: showInfo ? 1 : 0,
      }}
    >
      <div className=" z-10 flex w-80 flex-col gap-4 rounded-[10px] bg-white p-4 shadow-xl dark:bg-darkSecondaryBackground">
        <div className="flex flex-row ">
          <h3 className="flex-1 font-semibold">Description</h3>
          <button
            tabIndex={showInfo ? 0 : -1}
            onClick={() => setShowInfo(false)}
          >
            <CloseIcon size={22} color={"red"} />
          </button>
        </div>

        <textarea
          tabIndex={showInfo ? 0 : -1}
          ref={descriptionRef}
          value={description ? description : ""}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter skill description"
          style={{ resize: "none" }}
          className="min-h-24 w-full outline-none active:outline-none dark:bg-darkSecondaryBackground"
          name="description"
          id="description"
        />

        <div className="flex flex-row pr-1">
          <p className="flex-1 ">Show reps</p>
          <input
            tabIndex={showInfo ? 0 : -1}
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

export default SkillStationDescriptionModal;
