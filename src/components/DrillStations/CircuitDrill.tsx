import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PiDotsThreeCircleFill } from "react-icons/pi";
import { convertDurationToString } from "~/services/DurationFunctions";
import { DrillType } from "~/utils/types";
import CircuitDrillMedia from "./CircuitDrillMedia";
import CircuitDrillTextArea from "./CircuitDrillTextArea";
import DrillStationSettings from "./DrillStationSettings";
import CircuitDrillDuration from "./circuitDrillDuration";
import useUpdateDrill from "~/hooks/drillStationHooks/useUpdateDrill";
import useGetDrillMedia from "~/hooks/drillStationHooks/useGetDrillStationMedia";

interface Props {
  drill: DrillType;
}

export const CircuitDrill = ({ drill }: Props) => {
  const [description, setDescription] = useState<string>(drill.description);
  const [comments, setComments] = useState<string>(drill.comments);
  const [showComments, setShowComments] = useState<boolean>(
    drill.show_comments,
  );
  const [drillName, setDrillname] = useState<string>(drill.name);
  const [duration, setDuration] = useState<string>(drill.duration);
  const [showDuration, setShowDuration] = useState<boolean>(
    drill.show_duration,
  );

  const [editMedia, setEditMedia] = useState<boolean>(drill.show_edit_media);
  const [showMedia, setShowMedia] = useState<boolean>(drill.show_media);

  const [hideDurationPicker, setHideDurationPicker] = useState(true);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);

  const stationNameRef = useRef<HTMLTextAreaElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const commentsRef = useRef<HTMLTextAreaElement>(null);

  const { mutate: updateDrill } = useUpdateDrill();
  const { data: drillMedia } = useGetDrillMedia(drill.id);

  const durationString = useMemo(() => {
    const newDurationString = convertDurationToString(duration);
    if (newDurationString) {
      if (newDurationString[0] == "0") {
        setDuration("00:00:00");
        return "";
      } else {
        return newDurationString;
      }
    } else {
      return "";
    }
  }, [duration]);

  useEffect(() => {
    if (stationNameRef.current) {
      stationNameRef.current.style.height = "0";
      stationNameRef.current.style.height =
        stationNameRef.current.scrollHeight + "px";
    }
  }, [drillName]);

  const handleToggleComments = useCallback(
    (show: boolean) => {
      setShowComments(show);
      updateDrill({
        //
        show_comments: show,
        //
        comments: comments,
        description: description,
        drill_id: drill.id,
        name: drillName,
        duration: duration,
        show_duration: showDuration,
        show_edit_media: editMedia,
        show_media: showMedia,
        station_id: drill.station_id,
      });
    },
    [
      comments,
      description,
      drill.id,
      drillName,
      duration,
      showDuration,
      editMedia,
      showMedia,
      drill.station_id,
      updateDrill,
    ],
  );

  const handleToggleDuration = useCallback(
    (show: boolean) => {
      setShowDuration(show);

      updateDrill({
        //
        show_duration: show,
        //
        comments: comments,
        description: description,
        drill_id: drill.id,
        name: drillName,
        duration: duration,
        show_comments: showComments,
        show_edit_media: editMedia,
        show_media: showMedia,
        station_id: drill.station_id,
      });
    },
    [
      comments,
      description,
      drill.id,
      drillName,
      duration,
      showComments,
      editMedia,
      showMedia,
      drill.station_id,
      updateDrill,
    ],
  );

  return (
    <div className="relative flex flex-col gap-2">
      <div className="flex flex-row items-center gap-2">
        <button
          onClick={() => setShowSettingsModal(!showSettingsModal)}
          className="transition-all duration-150 active:scale-95"
        >
          <PiDotsThreeCircleFill color={"gray"} size={22} />
        </button>
        <DrillStationSettings
          editMedia={false}
          onToggleEditMedia={() => {}}
          onToggleShowComments={handleToggleComments}
          onToggleShowMedia={() => {}}
          showComments={showComments}
          showMedia={true}
          showSettingsModal={showSettingsModal}
          setShowSettingsModal={() => setShowSettingsModal(!showSettingsModal)}
          handleDeleteStation={() => {}}
          onToggleDuration={handleToggleDuration}
          showDuration={showDuration}
        />
        <textarea
          inputMode="text"
          ref={stationNameRef}
          value={drillName}
          onChange={(e) => setDrillname(e.target.value)}
          className="placeholder:text-textInput print:font-sm box-border w-28 max-w-60 resize-none  bg-transparent text-base font-semibold outline-none  active:outline-none print:w-full print:text-base"
          placeholder="Station Name"
        />
        <CircuitDrillDuration
          duration={duration}
          durationString={durationString}
          hideDurationPicker={hideDurationPicker}
          setHideDurationPicker={setHideDurationPicker}
          showDuration={showDuration}
          handledurationChange={() => {}}
        />
      </div>
      <div className="flex flex-1 flex-row gap-4">
        <div className="flex flex-[2] flex-row gap-4">
          <CircuitDrillTextArea
            placeholder="Description"
            setValue={setDescription}
            value={description}
            textAreaRef={descriptionRef}
          />

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
          mediaUrls={drillMedia}
          showMedia={true}
          onDeleteMedia={() => {}}
        />
      </div>
    </div>
  );
};
