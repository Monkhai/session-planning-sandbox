import React from "react";
import { IoCloseCircleSharp } from "react-icons/io5";

interface Props {
  showSettingsModal: boolean;
  setShowSettingsModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeleteStation: () => void;
  onToggleDuration: (show: boolean) => void;
  showDuration: boolean;
  showComments: boolean;
  showMedia: boolean;
  editMedia: boolean;
  onToggleShowComments: (show: boolean) => void;
  onToggleShowMedia: (show: boolean) => void;
  onToggleEditMedia: (show: boolean) => void;
  title?: string;
  onAddDrill?: () => void;
}

const DrillStationSettings = ({
  handleDeleteStation,
  showDuration,
  setShowSettingsModal,
  showSettingsModal,
  onToggleDuration,
  showComments,
  editMedia,
  onToggleShowComments,
  onToggleShowMedia,
  onToggleEditMedia,
  showMedia,
  onAddDrill,
  title = "Station Settings",
}: Props) => {
  return (
    <div className="z-10">
      <div
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
            <h3 className="font-lg flex-1 font-semibold">{title}</h3>
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
          {/*  */}
          <div className="flex w-full flex-1 flex-row items-center justify-between pr-1">
            <p className="">Show Comments</p>
            <input
              onChange={(e) => onToggleShowComments(e.target.checked)}
              checked={showComments ? showComments : false}
              className="h-4 w-4"
              type="checkbox"
              name="showDuration"
              id="showDuration"
            />
          </div>
          {/*  */}
          <div className="flex w-full flex-1 flex-row items-center justify-between pr-1">
            <p className="">Show Media</p>
            <input
              onChange={(e) => onToggleShowMedia(e.target.checked)}
              checked={showMedia ? showMedia : false}
              className="h-4 w-4"
              type="checkbox"
              name="showDuration"
              id="showDuration"
            />
          </div>
          {/*  */}
          <div className="flex w-full flex-1 flex-row items-center justify-between pr-1">
            <p className="">Edit Media</p>
            <input
              onChange={(e) => onToggleEditMedia(e.target.checked)}
              checked={editMedia ? editMedia : false}
              className="h-4 w-4"
              type="checkbox"
              name="showDuration"
              id="showDuration"
            />
          </div>
          {/*  */}
          {onAddDrill ? (
            <div className=" w-full pt-2">
              <button
                onClick={onAddDrill}
                className="w-full rounded-[12px] bg-primary px-4 py-2 text-white transition-all duration-150 active:scale-95"
              >
                Add Drill
              </button>
            </div>
          ) : null}
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
