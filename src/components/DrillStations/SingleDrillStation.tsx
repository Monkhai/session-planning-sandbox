import React, { useCallback, useContext } from "react";
import { SessionContext } from "~/context/SessionIdContext";
import useCreateDrill from "~/hooks/drillStationHooks/useCreateDrill";
import useDeleteDrillStation from "~/hooks/drillStationHooks/useDeleteDrillStation";
import useDeleteMedia from "~/hooks/drillStationHooks/useDeleteMedia";
import useGetDrillStationMedia from "~/hooks/drillStationHooks/useGetDrillStationMedia";
import useSingleDrillState from "~/hooks/drillStationHooks/useSingleDrillStates";
import useUpdateDrill from "~/hooks/drillStationHooks/useUpdateDrill";
import useUploadMedia from "~/hooks/drillStationHooks/useUploadMedia";
import { DrillStationWithDrillsType, DrillType } from "~/utils/types";
import StationBottomBorder from "../SkillStation/StationBottomBorder";
import Spacer from "../utility/Spacer";
import DrillStationHeader from "./DrillStationHeader";
import DrillStationMedia from "./DrillStationMedia";
import DrillStationTextArea from "./DrillStationTextArea";
import { Reorder, useDragControls } from "framer-motion";

interface Props {
  drill: DrillType;
  isLast: boolean;
  onReorderEnd: () => void;
  dragValue: DrillStationWithDrillsType;
}

const SingleDrillStation = ({
  drill,
  isLast,
  onReorderEnd,
  dragValue,
}: Props) => {
  const { session_id } = useContext(SessionContext);

  const [showDurationPicker, setShowDurationPicker] = React.useState(false);
  const [showSettingsModal, setShowSettingsModal] =
    React.useState<boolean>(false);

  const stationNameRef = React.useRef<HTMLTextAreaElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const descriptionRef = React.useRef<HTMLTextAreaElement>(null);
  const commentsRef = React.useRef<HTMLTextAreaElement>(null);

  const {
    drillName,
    setDrillName,
    duration,
    setDuration,
    showDuration,
    setShowDuration,
    comments,
    setComments,
    description,
    setDescription,
    editMedia,
    setEditMedia,
    showComments,
    setShowComments,
    showMedia,
    setShowMedia,
    durationString,
  } = useSingleDrillState({
    drill,
    stationNameRef,
    descriptionRef,
    commentsRef,
    session_id,
  });

  const { mutate: updateDrill } = useUpdateDrill();
  const { mutate: deleteDrillStation } = useDeleteDrillStation();
  const { mutate: uploadMedia } = useUploadMedia();
  const { mutate: deleteMedia } = useDeleteMedia();
  const { mutate: addlDrillToCircuit } = useCreateDrill();
  const {
    data: drillMedia,
    isLoading: isMediaLoading,
    error: mediaError,
  } = useGetDrillStationMedia({
    drill_id: drill.id,
    session_id,
  });

  if (mediaError) {
    alert("Error fetching media");
  }

  const handleToggleDuration = useCallback(
    (show: boolean) => {
      setShowDuration(show);
      updateDrill({
        duration,
        comments,
        description,
        drill_id: drill.id,
        name: drillName,
        show_duration: show,
        show_comments: showComments,
        show_media: showMedia,
        show_edit_media: editMedia,
        station_id: drill.station_id,
        session_id,
        order: drill.order,
        drillOfStationId: drill.drillOfStationId,
      });
    },
    [
      duration,
      comments,
      description,
      drillName,
      drill.id,
      showComments,
      showMedia,
      editMedia,
      updateDrill,
    ],
  );

  const handleDeleteStation = useCallback(() => {
    const deleteMedia = drillMedia ? drillMedia.length > 0 : false;

    deleteDrillStation({
      station_id: drill.station_id,
      deleteMedia,
      drillsId: [drill.id],
      session_id,
    });
  }, [deleteDrillStation, drill.id, drillMedia]);

  const handleDeleteMedia = useCallback(
    (name: string) => {
      deleteMedia({
        name,
        station_id: drill.id,
        session_id,
      });
    },
    [deleteMedia, drill.id],
  );

  const handleDurationChange = useCallback(
    (newDuration: string) => {
      setDuration(newDuration);
      updateDrill({
        duration: newDuration,
        comments,
        description,
        name: drillName,
        station_id: drill.id,
        show_duration: showDuration,
        show_comments: showComments,
        show_media: showMedia,
        show_edit_media: editMedia,
        drill_id: drill.id,
        session_id,
        order: drill.order,
        drillOfStationId: drill.drillOfStationId,
      });
    },
    [
      comments,
      description,
      drillName,
      drill.id,
      showDuration,
      showComments,
      showMedia,
      editMedia,
      updateDrill,
    ],
  );

  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const file = e.target.files[0];
        if (file) {
          uploadMedia({
            station_id: drill.id,
            file: file,
            session_id,
          });
        } else {
          alert("no file found");
        }
      }
      e.target.value = "";
    },
    [uploadMedia, drill.id, session_id],
  );

  const handleToggleComments = useCallback(
    (show: boolean) => {
      setShowComments(show);
      updateDrill({
        duration: duration,
        comments: comments,
        description,
        name: drillName,
        station_id: drill.id,
        show_duration: showDuration,
        show_comments: show,
        show_media: showMedia,
        show_edit_media: editMedia,
        drill_id: drill.id,
        session_id,
        order: drill.order,
        drillOfStationId: drill.drillOfStationId,
      });
    },
    [
      duration,
      comments,
      description,
      drillName,
      drill.id,
      showDuration,
      showMedia,
      editMedia,
      updateDrill,
    ],
  );

  const handleToggleShowMedia = useCallback(
    (show: boolean) => {
      setShowMedia(show);
      updateDrill({
        duration: duration,
        comments: comments,
        description,
        name: drillName,
        station_id: drill.id,
        show_duration: showDuration,
        show_comments: showComments,
        show_media: show,
        show_edit_media: editMedia,
        drill_id: drill.id,
        session_id,
        order: drill.order,
        drillOfStationId: drill.drillOfStationId,
      });
    },
    [
      duration,
      comments,
      description,
      drillName,
      drill.id,
      showDuration,
      showComments,
      editMedia,
      updateDrill,
    ],
  );

  const handleToggleEditMedia = useCallback(
    (show: boolean) => {
      setEditMedia(show);
      updateDrill({
        duration: duration,
        comments: comments,
        description,
        name: drillName,
        station_id: drill.id,
        show_duration: showDuration,
        show_comments: showComments,
        show_media: showMedia,
        show_edit_media: show,
        drill_id: drill.id,
        session_id,
        order: drill.order,
        drillOfStationId: drill.drillOfStationId,
      });
    },
    [
      duration,
      comments,
      description,
      drillName,
      drill.id,
      showDuration,
      showComments,
      showMedia,
      updateDrill,
    ],
  );

  const handleAddDrill = useCallback(() => {
    addlDrillToCircuit({
      stationId: drill.station_id,
      lastOrder: drill.order,
      session_id,
    });
  }, [drill]);

  //---------------------------------------------
  //---------------------------------------------
  //---------------------------------------------

  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={dragValue}
      key={drill.id}
      dragControls={dragControls}
      dragListener={false}
      onDragEnd={onReorderEnd}
      className={
        "relative flex w-full flex-col px-2 py-2 print:px-2 print:py-1  md:flex-row md:px-10" +
        (isLast
          ? ""
          : " print:border-b-[1px] print:border-b-seperatorSecondary")
      }
    >
      <div className="flex flex-1">
        <DrillStationHeader
          dragControls={dragControls}
          onAddDrill={handleAddDrill}
          editMedia={editMedia}
          onToggleShowComments={handleToggleComments}
          onToggleShowMedia={handleToggleShowMedia}
          onToggleEditMedia={handleToggleEditMedia}
          showComments={showComments}
          showMedia={showMedia}
          duration={duration}
          durationString={durationString}
          stationName={drillName}
          stationNameRef={stationNameRef}
          setStationName={setDrillName}
          showSettingsModal={showSettingsModal}
          setShowSettingsModal={setShowSettingsModal}
          showDuration={showDuration}
          onToggleDuration={handleToggleDuration}
          handleDeleteStation={handleDeleteStation}
          handleDurationChange={handleDurationChange}
          showDurationPicker={showDurationPicker}
          setShowDurationPicker={setShowDurationPicker}
        />
      </div>
      <div className="flex flex-1 flex-col gap-4 print:w-3/5 md:w-1/2 md:flex-none">
        <DrillStationTextArea
          value={description}
          setValue={setDescription}
          textAreaRef={descriptionRef}
          title="Description"
          placeholder="Enter station description"
        />

        <DrillStationTextArea
          value={comments}
          setValue={setComments}
          textAreaRef={commentsRef}
          title="Comments"
          placeholder="Enter station comments"
          showComments={showComments}
        />

        <DrillStationMedia
          mediaInputRef={inputRef}
          mediaUrls={drillMedia}
          isMediaLoading={isMediaLoading}
          editMedia={editMedia}
          onDeleteMedia={handleDeleteMedia}
          onFileUpload={handleFileUpload}
          showMedia={showMedia}
        />
      </div>
      <StationBottomBorder isLast={isLast} />
      <Spacer showOnPrint={false} />
    </Reorder.Item>
  );
};

export default SingleDrillStation;
