import React from "react";
import CircuitDrillMedia from "./DrillStations/CircuitDrillMedia";
import CircuitDrillTextArea from "./DrillStations/CircuitDrillTextArea";
import CircuitStationHeader from "./DrillStations/CircuitStationHeader";

interface Props {
  isLast: boolean;
}

const CircuitDemo = ({ isLast }: Props) => {
  const [hideDurationPicker, setHideDurationPicker] = React.useState(true);
  const [showSettingsModal, setShowSettingsModal] =
    React.useState<boolean>(false);
  const [showDuration, setShowDuration] = React.useState<boolean>(false);
  const [stationName, setStationName] = React.useState<string>("");
  const [duration, setDuration] = React.useState<string>("");
  const [editMedia, setEditMedia] = React.useState<boolean>(false);
  const [showComments, setShowComments] = React.useState<boolean>(false);
  const [showMedia, setShowMedia] = React.useState<boolean>(false);

  const stationNameRef = React.useRef<HTMLTextAreaElement>(null);
  const descriptionRef = React.useRef<HTMLTextAreaElement>(null);
  const commentsRef = React.useRef<HTMLTextAreaElement>(null);

  const [description, setDescription] = React.useState<string>("");
  const [comments, setComments] = React.useState<string>("");

  const durationString = React.useMemo(() => {
    if (duration) {
      const durationArr = duration.split(":");
      const minutes = durationArr[0];
      const seconds = durationArr[1];
      return `${minutes} minutes ${seconds} seconds`;
    }
    return undefined;
  }, [duration]);

  const handleDurationChange = React.useCallback((duration: string) => {
    setDuration(duration);
  }, []);

  const handleToggleDuration = React.useCallback((show: boolean) => {
    setShowDuration(show);
  }, []);

  const handleDeleteStation = React.useCallback(() => {
    // deleteDrillStation({ station_id: station.id });
  }, []);

  return (
    <div
      className={
        "relative flex w-full flex-row px-10 py-2 print:px-2 print:py-1" +
        (isLast
          ? ""
          : " print:border-b-[1px] print:border-b-seperatorSecondary")
      }
    >
      <div className="flex flex-1">
        <CircuitStationHeader
          duration={duration}
          durationString={durationString}
          handleDurationChange={handleDurationChange}
          handleDeleteStation={handleDeleteStation}
          hideDurationPicker={hideDurationPicker}
          onToggleDuration={handleToggleDuration}
          setHideDurationPicker={setHideDurationPicker}
          setStationName={setStationName}
          setShowSettingsModal={setShowSettingsModal}
          showDuration={showDuration}
          showSettingsModal={showSettingsModal}
          stationName={stationName}
          stationNameRef={stationNameRef}
        />
      </div>

      <CircuitDrill
        commentsRef={commentsRef}
        descriptionRef={descriptionRef}
        description={description}
        setDescription={setDescription}
        comments={comments}
        setComments={setComments}
      />
    </div>
  );
};

export default CircuitDemo;

interface DrillProps {
  descriptionRef: React.RefObject<HTMLTextAreaElement>;
  commentsRef: React.RefObject<HTMLTextAreaElement>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  comments: string;
  setComments: React.Dispatch<React.SetStateAction<string>>;
}

export const CircuitDrill = ({
  commentsRef,
  descriptionRef,
  description,
  setDescription,
  comments,
  setComments,
}: DrillProps) => {
  const [showComments, setShowComments] = React.useState<boolean>(true);

  return (
    <div className="flex flex-[3] flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h4 className="text-darkTextInput">Drill2</h4>
        <div className="flex flex-1 flex-row gap-4">
          <div className="flex flex-[2] flex-row gap-4">
            {showComments && (
              <CircuitDrillTextArea
                placeholder="Comments"
                setValue={setDescription}
                value={description}
                textAreaRef={descriptionRef}
              />
            )}
            {showComments && (
              <CircuitDrillTextArea
                placeholder="Comments"
                setValue={setComments}
                value={comments}
                textAreaRef={commentsRef}
              />
            )}
          </div>
          <CircuitDrillMedia
            editMedia={false}
            isMediaLoading={false}
            mediaUrls={[]}
            showMedia={true}
            onDeleteMedia={() => {}}
          />
        </div>
      </div>
      {/*  */}
    </div>
  );
};
