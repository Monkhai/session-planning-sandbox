import React from "react";
import StationDuration from "../StationDuration";
import StationTitle from "../StationTitle";
import SettingsIcon from "../icons/SettingsIcon";
import DrillStationSettings from "./DrillStationSettings";
import { DragControls } from "framer-motion";
import ReorderController from "../ReorderController";

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
  editMedia: boolean;
  onToggleShowComments: (show: boolean) => void;
  onToggleShowMedia: (show: boolean) => void;
  showComments: boolean;
  showMedia: boolean;
  onToggleEditMedia: (show: boolean) => void;
  onAddDrill: () => void;
  onReorderEnd: () => void;
  dragControls: DragControls;
}

const DrillStationHeader = ({
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
  editMedia,
  onToggleShowComments,
  onToggleShowMedia,
  showComments,
  showMedia,
  onToggleEditMedia,
  dragControls,
  onReorderEnd,
}: Props) => {
  const controlButtonRef = React.useRef<HTMLButtonElement>(null);

  return (
    <div className="flex w-full flex-col items-start justify-start py-2 md:min-h-20">
      <div className="flex flex-row items-center justify-center gap-4">
        <ReorderController
          controls={dragControls}
          handleReorderEnd={onReorderEnd}
        />
        <div className="relative flex print:hidden">
          <button
            ref={controlButtonRef}
            className="transition-all duration-150 active:scale-95"
            onClick={() => setShowSettingsModal(!showSettingsModal)}
          >
            <SettingsIcon size={28} color={"gray"} />
          </button>
          <DrillStationSettings
            controlButtonRef={controlButtonRef}
            onAddDrill={onAddDrill}
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

export default DrillStationHeader;
