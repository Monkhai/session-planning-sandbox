import React from "react";
import { IoCloseCircleSharp } from "react-icons/io5";

interface Props {
  showSettingsModal: boolean;
  setShowSettingsModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeleteStation: () => void;
  onToggleDuration: (show: boolean) => void;
  showDuration: boolean;
}

const DrillStationSettings = ({
  handleDeleteStation,
  showDuration,
  setShowSettingsModal,
  showSettingsModal,
  onToggleDuration,
}: Props) => {
  return (
    <div className="z-10">
      <div
        className="absolute left-4 top-10 w-80"
        style={{
          transition: "all 0.150s ease-in-out",
          scale: showSettingsModal ? 1 : 0,
          opacity: showSettingsModal ? 1 : 0,
          transformOrigin: "top left",
        }}
      >
        <div className="flex w-full flex-col items-start gap-2 rounded-[10px] bg-white p-4 shadow-xl dark:bg-darkSecondaryBackground">
          <div className="flex w-full flex-1 flex-row justify-between pb-2">
            <h3 className="font-lg flex-1 font-semibold">Station Settings</h3>
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
