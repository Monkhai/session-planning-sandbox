import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PiDotsThreeCircleFill } from "react-icons/pi";
import useDeleteDrill from "~/hooks/drillStationHooks/useDeleteDrill";
import useGetDrillMedia from "~/hooks/drillStationHooks/useGetDrillStationMedia";
import useUpdateDrill from "~/hooks/drillStationHooks/useUpdateDrill";
import { convertDurationToString } from "~/services/DurationFunctions";
import { DrillType } from "~/utils/types";
import DrillStationSettings from "./DrillStationSettings";
import CircuitDrillDuration from "./circuitDrillDuration";
import useAutoResizeTextarea from "~/hooks/useAutoResizeTextArea";
import { useParams } from "next/navigation";

interface Props {
  drill: DrillType;
  comments: string;
  description: string;
  showMedia: boolean;
  setEditMedia: React.Dispatch<React.SetStateAction<boolean>>;
  editMedia: boolean;
  setShowMedia: React.Dispatch<React.SetStateAction<boolean>>;
  drillName: string;
  setDrillname: React.Dispatch<React.SetStateAction<string>>;
  duration: string;
  setDuration: React.Dispatch<React.SetStateAction<string>>;
  showDuration: boolean;
  setShowDuration: React.Dispatch<React.SetStateAction<boolean>>;
  showComments: boolean;
  setShowComments: React.Dispatch<React.SetStateAction<boolean>>;
}

const CircuitDrillHeader = ({
  drill,
  comments,
  description,
  setEditMedia,
  showMedia,
  editMedia,
  setShowMedia,
  drillName,
  setDrillname,
  duration,
  setDuration,
  showDuration,
  setShowDuration,
  showComments,
  setShowComments,
}: Props) => {
  const { id: session_id } = useParams<{ id: string }>();

  const { mutate: updateDrill } = useUpdateDrill();
  const { data: drillMedia } = useGetDrillMedia(drill.id, session_id);
  const { mutate: deleteDrillStation } = useDeleteDrill();

  const [hideDurationPicker, setHideDurationPicker] = useState(true);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);

  const stationNameRef = useAutoResizeTextarea(drillName);

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
    const handleBlur = () => {
      if (drillName !== drill.name) {
        updateDrill({
          //
          name: drillName,
          //
          comments: comments,
          description: description,
          drill_id: drill.id,
          duration: duration,
          show_comments: showComments,
          show_duration: showDuration,
          show_edit_media: editMedia,
          show_media: showMedia,
          station_id: drill.station_id,
          session_id: session_id,
        });
      }
    };

    stationNameRef.current?.addEventListener("blur", handleBlur);

    return () => {
      stationNameRef.current?.removeEventListener("blur", handleBlur);
    };
  }, [
    drillName,
    drill.id,
    description,
    comments,
    showComments,
    showDuration,
    editMedia,
    showMedia,
    drill.station_id,
    updateDrill,
    stationNameRef,
    session_id,
  ]);

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
        session_id: session_id,
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
      session_id,
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
        session_id: session_id,
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
      session_id,
    ],
  );

  const handleToggleEditMedia = useCallback(
    (show: boolean) => {
      setEditMedia(show);
      updateDrill({
        //
        show_edit_media: show,
        //
        comments: comments,
        description: description,
        drill_id: drill.id,
        name: drillName,
        duration: duration,
        show_comments: showComments,
        show_duration: showDuration,
        show_media: showMedia,
        station_id: drill.station_id,
        session_id: session_id,
      });
    },
    [
      comments,
      description,
      drill.id,
      drillName,
      duration,
      showComments,
      showDuration,
      showMedia,
      drill.station_id,
      updateDrill,
      session_id,
    ],
  );

  const handleToggleShowMedia = useCallback(
    (show: boolean) => {
      setShowMedia(show);
      updateDrill({
        //
        show_media: show,
        //
        comments: comments,
        description: description,
        drill_id: drill.id,
        name: drillName,
        duration: duration,
        show_comments: showComments,
        show_duration: showDuration,
        show_edit_media: editMedia,
        station_id: drill.station_id,
        session_id: session_id,
      });
    },
    [
      comments,
      description,
      drill.id,
      drillName,
      duration,
      showComments,
      showDuration,
      editMedia,
      drill.station_id,
      updateDrill,
      session_id,
    ],
  );

  const handleDeleteDrill = useCallback(() => {
    const deleteMedia =
      drillMedia?.length && drillMedia.length > 0 ? true : false;
    deleteDrillStation({
      drillId: drill.id,
      stationId: drill.station_id,
      deleteMedia,
      session_id: session_id,
    });
  }, [deleteDrillStation, drill.id, drillMedia, drill.station_id, session_id]);

  const handleDurationChange = useCallback(
    (duration: string) => {
      setDuration(duration);
      updateDrill({
        //
        duration: duration,
        //
        comments: comments,
        description: description,
        drill_id: drill.id,
        name: drillName,
        show_comments: showComments,
        show_duration: showDuration,
        show_edit_media: editMedia,
        show_media: showMedia,
        station_id: drill.station_id,
        session_id: session_id,
      });
    },
    [
      comments,
      description,
      drill.id,
      drillName,
      showComments,
      showDuration,
      editMedia,
      showMedia,
      drill.station_id,
      updateDrill,
      session_id,
    ],
  );

  return (
    <div>
      <div className="relative flex flex-row items-center gap-0">
        <div className="relative flex print:hidden">
          <button
            onClick={() => setShowSettingsModal(!showSettingsModal)}
            className="mr-1 transition-all duration-150 active:scale-95"
          >
            <PiDotsThreeCircleFill color={"gray"} size={22} />
          </button>
          <DrillStationSettings
            title="Drill Settings"
            setShowSettingsModal={() =>
              setShowSettingsModal(!showSettingsModal)
            }
            editMedia={editMedia}
            onToggleEditMedia={handleToggleEditMedia}
            onToggleShowComments={handleToggleComments}
            onToggleShowMedia={handleToggleShowMedia}
            showComments={showComments}
            showMedia={showMedia}
            showSettingsModal={showSettingsModal}
            handleDeleteStation={handleDeleteDrill}
            onToggleDuration={handleToggleDuration}
            showDuration={showDuration}
          />
        </div>
        {/* title */}
        <div className="flex flex-row items-center">
          <textarea
            inputMode="text"
            ref={stationNameRef}
            value={drillName}
            onChange={(e) => setDrillname(e.target.value)}
            className="placeholder:text-textInput print:font-sm box-border w-28 max-w-60 resize-none bg-transparent text-base font-semibold outline-none active:outline-none print:w-full print:text-base"
            placeholder="Station Name"
          />
          <CircuitDrillDuration
            duration={duration}
            durationString={durationString}
            hideDurationPicker={hideDurationPicker}
            setHideDurationPicker={setHideDurationPicker}
            showDuration={showDuration}
            handledurationChange={handleDurationChange}
          />
        </div>
      </div>
    </div>
  );
};

export default CircuitDrillHeader;
