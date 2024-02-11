import React from "react";
import { PiDotsThreeCircleFill } from "react-icons/pi";
import StationDuration from "../StationDuration";
import StationTitle from "../StationTitle";
import CircuitStationSettings from "./CircuitStationSettings";

interface Props {
  setShowSettingsModal: React.Dispatch<React.SetStateAction<boolean>>;
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
  onAddDrill: () => void;
}

const CircuitStationHeader = ({
  onAddDrill,
  handleDeleteStation,
  onToggleDuration,
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
}: Props) => {
  const controlButtonRef = React.useRef<HTMLButtonElement>(null);
  return (
    <div className="flex min-h-20 w-full flex-row items-start justify-around gap-2 py-2">
      <div className="relative bottom-1 flex flex-row print:hidden">
        <button
          ref={controlButtonRef}
          className="transition-all duration-150 active:scale-95"
          onClick={() => setShowSettingsModal(!showSettingsModal)}
        >
          <PiDotsThreeCircleFill size={36} color={"gray"} />
        </button>
        <CircuitStationSettings
          controlButtonRef={controlButtonRef}
          onAddDrill={onAddDrill}
          showDuration={showDuration}
          onToggleDuration={onToggleDuration}
          showSettingsModal={showSettingsModal}
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
          showDurationPicker={showDurationPicker}
          setShowDurationPicker={setShowDurationPicker}
        />
      </div>
    </div>
  );
};

export default CircuitStationHeader;
