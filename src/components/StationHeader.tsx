import React from "react";
import StationSettings from "./DrillStations/StationSettings";
import StationDuration from "./StationDuration";
import StationTitle from "./StationTitle";
import SettingsIcon from "./icons/SettingsIcon";
import ReorderController from "./ReorderController";
import { DragControls, useDragControls } from "framer-motion";

interface Props {
  setShowSettingsModal: React.Dispatch<React.SetStateAction<boolean>>;
  setEditSkills: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeleteStation: () => void;
  showSettingsModal: boolean;
  onToggleDuration: (show: boolean) => void;
  stationName: string;
  setStationName: React.Dispatch<React.SetStateAction<string>>;
  stationNameRef: React.RefObject<HTMLTextAreaElement>;
  showDurationPicker: boolean;
  setShowDurationPicker: React.Dispatch<React.SetStateAction<boolean>>;
  duration: string;
  durationString: string | undefined;
  showDuration: boolean;
  handleDurationChange: (duration: string) => void;
  dragControls: DragControls;
}

const StationHeader = ({
  handleDeleteStation,
  onToggleDuration,
  setEditSkills,
  setShowSettingsModal,
  showSettingsModal,
  duration,
  durationString,
  handleDurationChange,
  showDurationPicker,
  setShowDurationPicker,
  setStationName,
  stationName,
  stationNameRef,
  showDuration,
  dragControls,
}: Props) => {
  const controlButtonRef = React.useRef<HTMLButtonElement>(null);

  return (
    <div className="flex w-full flex-col items-start justify-start py-2 md:min-h-20">
      <div className="flex flex-row items-center justify-center gap-4">
        <ReorderController controls={dragControls} />
        <div className="relative flex print:hidden">
          <button
            ref={controlButtonRef}
            className="transition-all duration-150 active:scale-95"
            onClick={() => setShowSettingsModal(!showSettingsModal)}
          >
            <SettingsIcon size={28} color={"gray"} />
          </button>
          <StationSettings
            controlButtonRef={controlButtonRef}
            showDuration={showDuration}
            onToggleDuration={onToggleDuration}
            showSettingsModal={showSettingsModal}
            setEditSkills={setEditSkills}
            setShowSettingsModal={setShowSettingsModal}
            handleDeleteStation={handleDeleteStation}
          />
        </div>
        <StationTitle
          stationName={stationName}
          setStationName={setStationName}
          stationNameRef={stationNameRef}
        />
      </div>

      <div className="pl-[38px]">
        <StationDuration
          duration={duration}
          durationString={durationString}
          showDuration={showDuration}
          handledurationChange={handleDurationChange}
          showDurationPicker={showDurationPicker}
          setShowDurationPicker={setShowDurationPicker}
        />
      </div>
    </div>
  );
};

export default StationHeader;
