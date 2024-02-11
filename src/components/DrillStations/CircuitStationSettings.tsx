import React from "react";
import { IoCloseCircleSharp } from "react-icons/io5";
import useModalControl from "~/hooks/useModalControl";

interface Props {
  showSettingsModal: boolean;
  setShowSettingsModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeleteStation: () => void;
  onToggleDuration: (show: boolean) => void;
  onAddDrill: () => void;
  showDuration: boolean;
  controlButtonRef: React.RefObject<HTMLButtonElement>;
}

const DrillStationSettings = ({
  onAddDrill,
  handleDeleteStation,
  showDuration,
  setShowSettingsModal,
  showSettingsModal,
  onToggleDuration,
  controlButtonRef,
}: Props) => {
  const ref = React.useRef<HTMLDivElement>(null);
  useModalControl(
    ref,
    showSettingsModal,
    setShowSettingsModal,
    controlButtonRef,
  );

  return (
    <div className="z-10">
      <div
        ref={ref}
        className="absolute w-80"
        style={{
          transition: "all 0.150s ease-in-out",
          scale: showSettingsModal ? 1 : 0,
          opacity: showSettingsModal ? 1 : 0,
          transformOrigin: "top left",
        }}
      >
        <div className="flex w-full flex-col items-start gap-2 rounded-[10px] border-2 border-seperator bg-white p-4 shadow-xl dark:border-darkSeperator dark:bg-darkSecondaryBackground">
          <div className="flex w-full flex-1 flex-row justify-between pb-2">
            <h3 className="font-lg flex-1 font-semibold">Circuit Settings</h3>
            <button
              onClick={() => setShowSettingsModal(false)}
              className="transition-all duration-150 active:scale-95"
            >
              <IoCloseCircleSharp size={24} color={"var(--color-blue)"} />
            </button>
          </div>
          {/*  */}
          <div className="flex w-full flex-1 flex-row items-center justify-between pr-1">
            <p className="">Show Duration</p>
            <input
              onChange={(e) => onToggleDuration(e.target.checked)}
              checked={showDuration ? showDuration : false}
              className="h-4 w-4"
              type="checkbox"
              name="showDuration"
              id="showDuration"
            />
          </div>
          <div className=" w-full pt-2">
            <button
              onClick={onAddDrill}
              className="w-full rounded-[12px] bg-primary px-4 py-2 text-white transition-all duration-150 active:scale-95"
            >
              Add Drill
            </button>
          </div>
          <div className=" w-full pt-2">
            <button
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

export default DrillStationSettings;
