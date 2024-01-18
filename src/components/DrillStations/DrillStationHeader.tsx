import React, { useContext } from "react";
import { PiDotsThreeCircleFill } from "react-icons/pi";
import StationDuration from "../StationDuration";
import StationTitle from "../StationTitle";
import DrillStationSettings from "./DrillStationSettings";
import { FetchStatus } from "@tanstack/react-query";
import { FetchContext } from "~/context/FetchContext";

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
  onToggleShowComments: (show: boolean) => void;
  onToggleShowMedia: (show: boolean) => void;
  showComments: boolean;
  showMedia: boolean;
  onToggleEditMedia: (show: boolean) => void;
}

const DrillStationHeader = ({
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
  onToggleShowComments,
  onToggleShowMedia,
  showComments,
  showMedia,
  onToggleEditMedia,
}: Props) => {
  const { fetchStatus } = useContext(FetchContext);

  return (
    <div className="flex min-h-20 w-full flex-row items-start justify-around gap-2 py-2">
      <div className="relative bottom-1 flex flex-row print:hidden">
        <button
          style={{
            opacity: fetchStatus === "fetching" ? 0.5 : 1,
          }}
          disabled={fetchStatus === "fetching"}
          className="transition-all duration-150 active:scale-95"
          onClick={() => setShowSettingsModal(!showSettingsModal)}
        >
          <PiDotsThreeCircleFill size={36} color={"gray"} />
        </button>
        <DrillStationSettings
          editMedia={editMedia}
          onToggleShowComments={onToggleShowComments}
          onToggleShowMedia={onToggleShowMedia}
          onToggleEditMedia={onToggleEditMedia}
          showComments={showComments}
          showMedia={showMedia}
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
          hideDurationPicker={hideDurationPicker}
          setHideDurationPicker={setHideDurationPicker}
        />
      </div>
    </div>
  );
};

export default DrillStationHeader;
