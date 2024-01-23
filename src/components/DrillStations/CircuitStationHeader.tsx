import React from "react";
import { PiDotsThreeCircleFill } from "react-icons/pi";
import StationDuration from "../StationDuration";
import StationTitle from "../StationTitle";
import DrillStationSettings from "./DrillStationSettings";
import CircuitStationSettings from "./CircuitStationSettings";

interface Props {
  setShowSettingsModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeleteStation: () => void;
  showSettingsModal: boolean;
  onToggleDuration: (show: boolean) => void;
  stationName: string;
  setStationName: React.Dispatch<React.SetStateAction<string>>;
  stationNameRef: React.RefObject<HTMLTextAreaElement>;
  hideDurationPicker: boolean;
  setHideDurationPicker: React.Dispatch<React.SetStateAction<boolean>>;
  duration: string;
  durationString: string | undefined;
  showDuration: boolean;
  handleDurationChange: (duration: string) => void;
  editMedia: boolean;
}

const CircuitStationHeader = ({
  handleDeleteStation,
  onToggleDuration,
  setShowSettingsModal,
  showSettingsModal,
  duration,
  durationString,
  handleDurationChange,
  hideDurationPicker,
  setHideDurationPicker,
  setStationName,
  stationName,
  stationNameRef,
  showDuration,
  editMedia,
}: Props) => {
  return (
    <div className="flex  min-h-20 w-full flex-1 flex-row items-start justify-around gap-2 py-2">
      <div className="relative bottom-1 flex flex-row print:hidden">
        <button
          className="transition-all duration-150 active:scale-95"
          onClick={() => setShowSettingsModal(!showSettingsModal)}
        >
          <PiDotsThreeCircleFill size={36} color={"gray"} />
        </button>
      </div>
      <CircuitStationSettings
        editMedia={editMedia}
        showDuration={showDuration}
        showSettingsModal={showSettingsModal}
        setShowSettingsModal={setShowSettingsModal}
        onToggleDuration={onToggleDuration}
        handleDeleteStation={handleDeleteStation}
      />

      <div className="flex-1 pr-6">
        <StationTitle
          stationName={stationName}
          setStationName={setStationName}
          stationNameRef={stationNameRef}
        />
        <StationDuration
          duration={duration}
          durationString={durationString}
          showDuration={showDuration}
          handledurationChange={handleDurationChange}
          hideDurationPicker={hideDurationPicker}
          setHideDurationPicker={setHideDurationPicker}
        />
      </div>
    </div>
  );
};

export default CircuitStationHeader;
