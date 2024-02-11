import React, { useRef } from "react";
import useModalControl from "~/hooks/useModalControl";
import CloseIcon from "../icons/CloseIcon";

interface Props {
  showSettingsModal: boolean;
  setShowSettingsModal: React.Dispatch<React.SetStateAction<boolean>>;
  setEditSkills: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeleteStation: () => void;
  onToggleDuration: (show: boolean) => void;
  showDuration: boolean;
  controlButtonRef: React.RefObject<HTMLButtonElement>;
}

const StationSettings = ({
  handleDeleteStation,
  showDuration,
  setShowSettingsModal,
  setEditSkills,
  showSettingsModal,
  onToggleDuration,
  controlButtonRef,
}: Props) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useModalControl(
    modalRef,
    showSettingsModal,
    setShowSettingsModal,
    controlButtonRef,
  );

  return (
    <div className="z-10">
      <div
        ref={modalRef}
        style={{
          transition: "all 0.150s ease-in-out",
          scale: showSettingsModal ? 1 : 0,
          opacity: showSettingsModal ? 1 : 0,
          transformOrigin: "top left",
        }}
        className="absolute left-6 top-8 w-60 md:top-10 md:w-80"
      >
        <div className="flex w-full flex-col items-start gap-2 rounded-[10px] border-2 border-seperator bg-white p-4 shadow-xl dark:border-darkSeperator dark:bg-darkSecondaryBackground">
          <div className="flex w-full flex-1 flex-row justify-between pb-2">
            <h3 className="font-lg flex-1 font-semibold">Station Settings</h3>
            <button
              tabIndex={showSettingsModal ? 0 : -1}
              onClick={() => setShowSettingsModal(false)}
              className="transition-all duration-150 active:scale-95"
            >
              <CloseIcon size={22} color={"red"} />
            </button>
          </div>
          <div className="flex w-full flex-1 flex-row items-center justify-between pr-1">
            <p className="">Show Duration</p>
            <input
              tabIndex={showSettingsModal ? 0 : -1}
              onChange={(e) => onToggleDuration(e.target.checked)}
              checked={showDuration}
              className="h-4 w-4"
              type="checkbox"
              name="showDuration"
              id="showDuration"
            />
          </div>
          <div className="flex w-full flex-1 flex-row items-center justify-between pr-1">
            <p className="">Edit Skills</p>
            <input
              tabIndex={showSettingsModal ? 0 : -1}
              onChange={(e) => setEditSkills(e.target.checked)}
              className="h-4 w-4"
              type="checkbox"
              name="editSkills"
              id="editSkills"
            />
          </div>
          <div className=" w-full pt-2">
            <button
              tabIndex={showSettingsModal ? 0 : -1}
              onClick={handleDeleteStation}
              className="w-full rounded-[12px] bg-red-500 px-4 py-2 text-white transition-all duration-150 active:scale-95"
            >
              Delete Station
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StationSettings;
