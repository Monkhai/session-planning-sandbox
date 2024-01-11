import React from "react";
import { IoCloseCircleSharp } from "react-icons/io5";

interface Props {
  showEditModal: boolean;
  setShowEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  setEditSkills: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeleteStation: () => void;
  setShowDurationPicker: React.Dispatch<React.SetStateAction<boolean>>;
}

const StationSettings = ({
  handleDeleteStation,
  setShowEditModal,
  setEditSkills,
  showEditModal,
  setShowDurationPicker,
}: Props) => {
  return (
    <div className="z-10">
      <div
        className="absolute right-4 top-10 w-80"
        style={{
          transition: "all 0.150s ease-in-out",
          scale: showEditModal ? 1 : 0,
          opacity: showEditModal ? 1 : 0,
          transformOrigin: "top right",
        }}
      >
        <div className="flex w-full flex-col items-start gap-2 rounded-[10px] bg-white p-4 shadow-xl">
          <div className="flex w-full flex-1 flex-row justify-between pb-2">
            <h2 className="font-lg flex-1 font-semibold">Station Settings</h2>
            <button
              onClick={() => setShowEditModal(false)}
              className="transition-all duration-150 active:scale-95"
            >
              <IoCloseCircleSharp size={24} color={"var(--color-blue)"} />
            </button>
          </div>
          <div className="flex w-full flex-1 flex-row items-center justify-between pr-1">
            <p className="">Show Duration</p>
            <input
              onChange={(e) => setShowDurationPicker(e.target.checked)}
              className="h-4 w-4"
              type="checkbox"
              name="showDuration"
              id="showDuration"
            />
          </div>
          <div className="flex w-full flex-1 flex-row items-center justify-between pr-1">
            <p className="">Edit Skills</p>
            <input
              onChange={(e) => setEditSkills(e.target.checked)}
              className="h-4 w-4"
              type="checkbox"
              name="editSkills"
              id="editSkills"
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

export default StationSettings;
