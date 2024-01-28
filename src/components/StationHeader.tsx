import React from "react";
import { PiDotsThreeCircleFill } from "react-icons/pi";
import StationSettings from "./DrillStations/StationSettings";
import StationDuration from "./StationDuration";
import StationTitle from "./StationTitle";

interface Props {
  setShowSettingsModal: React.Dispatch<React.SetStateAction<boolean>>;
  setEditSkills: React.Dispatch<React.SetStateAction<boolean>>;
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
  hideDurationPicker,
  setHideDurationPicker,
  setStationName,
  stationName,
  stationNameRef,
  showDuration,
}: Props) => {
  return (
    <div className="flex w-full flex-row items-start justify-around gap-2 py-2 md:min-h-20">
      <div className="relative bottom-1 flex print:hidden">
        <button
          className="transition-all duration-150 active:scale-95"
          onClick={() => setShowSettingsModal(!showSettingsModal)}
        >
          <PiDotsThreeCircleFill className="h-[36px] w-[36px]" color={"gray"} />
        </button>
        <StationSettings
          showDuration={showDuration}
          onToggleDuration={onToggleDuration}
          showSettingsModal={showSettingsModal}
          setEditSkills={setEditSkills}
          setShowSettingsModal={setShowSettingsModal}
          handleDeleteStation={handleDeleteStation}
        />
      </div>

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

export default StationHeader;
