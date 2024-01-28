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
import useDeleteDrillStation from "~/hooks/drillStationHooks/useDeleteDrillStation";
import useDeleteDrill from "~/hooks/drillStationHooks/useDeleteDrill";
import useDeleteMedia from "~/hooks/drillStationHooks/useDeleteMedia";
import useUploadMedia from "~/hooks/drillStationHooks/useUploadMedia";

interface Props {
  drill: DrillType;
}

export const CircuitDrill = ({ drill }: Props) => {
  const [description, setDescription] = useState<string>(
    drill.description ? drill.description : "",
  );
  const [comments, setComments] = useState<string>(
    drill.comments ? drill.comments : "",
  );
  const [showComments, setShowComments] = useState<boolean>(
    drill.show_comments,
  );
  const [drillName, setDrillname] = useState<string>(
    drill.name ? drill.name : "",
  );
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
  const { data: drillMedia, isLoading: isMediaLoading } = useGetDrillMedia(
    drill.id,
  );
  const { mutate: deleteDrillStation } = useDeleteDrill();
  const { mutate: deleteMedia } = useDeleteMedia();
  const { mutate: uploadMedia } = useUploadMedia();

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

  useEffect(() => {
    const handleBlur = () => {
      if (
        drillName !== drill.name ||
        description !== drill.description ||
        comments !== drill.comments
      ) {
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
        });
      }
    };

    stationNameRef.current?.addEventListener("blur", handleBlur);
    descriptionRef.current?.addEventListener("blur", handleBlur);
    commentsRef.current?.addEventListener("blur", handleBlur);

    return () => {
      stationNameRef.current?.removeEventListener("blur", handleBlur);
      descriptionRef.current?.removeEventListener("blur", handleBlur);
      commentsRef.current?.removeEventListener("blur", handleBlur);
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
    descriptionRef,
    commentsRef,
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
    ],
  );

  const handleDeleteDrill = useCallback(() => {
    const deleteMedia =
      drillMedia?.length && drillMedia.length > 0 ? true : false;
    deleteDrillStation({
      drillId: drill.id,
      stationId: drill.station_id,
      deleteMedia,
    });
  }, [deleteDrillStation, drill.id, drillMedia, drill.station_id]);

  const handleDeleteMedia = (name: string) => {
    deleteMedia({ name, station_id: drill.id });
  };

  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const file = e.target.files[0];
        if (file) {
          uploadMedia({ station_id: drill.id, file: file });
        } else {
          alert("no file found");
        }
      }
      e.target.value = "";
    },
    [uploadMedia, drill.id],
  );

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
    ],
  );

  return (
    <div className="relative flex flex-col gap-2">
      <div className="flex flex-row items-center gap-0">
        <button
          onClick={() => setShowSettingsModal(!showSettingsModal)}
          className="mr-1 transition-all duration-150 active:scale-95"
        >
          <PiDotsThreeCircleFill color={"gray"} size={22} />
        </button>
        <DrillStationSettings
          title="Drill Settings"
          setShowSettingsModal={() => setShowSettingsModal(!showSettingsModal)}
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
          handledurationChange={handleDurationChange}
        />
      </div>
      <div className="flex flex-1 flex-col gap-8 md:flex-row md:gap-4">
        <div className="flex flex-[2] flex-row gap-4">
          <CircuitDrillTextArea
            placeholder="Description"
            setValue={setDescription}
            value={description}
            textAreaRef={descriptionRef}
          />

          {showComments ? (
            <CircuitDrillTextArea
              placeholder="Comments"
              setValue={setComments}
              value={comments}
              textAreaRef={commentsRef}
            />
          ) : null}
        </div>
        <CircuitDrillMedia
          onFileUpload={handleFileUpload}
          editMedia={editMedia}
          isMediaLoading={isMediaLoading}
          mediaUrls={drillMedia}
          showMedia={showMedia}
          onDeleteMedia={handleDeleteMedia}
        />
      </div>
    </div>
  );
};
