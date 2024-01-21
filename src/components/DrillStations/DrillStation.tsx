import React, { useCallback } from "react";
import useDeleteDrillStation from "~/hooks/skillStationHooks/useDeleteDrillStation";
import { DrillStationType } from "~/utils/types";
import StationBottomBorder from "../SkillStation/StationBottomBorder";
import Spacer from "../utility/Spacer";
import DrillStationHeader from "./DrillStationHeader";
import DrillStationMedia from "./DrillStationMedia";
import DrillStationTextArea from "./DrillStationTextArea";
import SingleDrill from "./Drill";

interface Props {
  station: DrillStationType;
  isLast: boolean;
}

const DrillStation = ({ station, isLast }: Props) => {
  const [hideDurationPicker, setHideDurationPicker] = React.useState(true);
  const [showSettingsModal, setShowSettingsModal] =
    React.useState<boolean>(false);

  const stationNameRef = React.useRef<HTMLTextAreaElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const descriptionRef = React.useRef<HTMLTextAreaElement>(null);
  const commentsRef = React.useRef<HTMLTextAreaElement>(null);

  const {
    updateDrillStation,
    stationName,
    setStationName,
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
  } = useDrillStationStates({
    drill,
    stationNameRef,
    descriptionRef,
    commentsRef,
  });

  // const { mutate: updateDrillStation } = useUpdateDrillStation();
  const { mutate: deleteDrillStation } = useDeleteDrillStation();
  // const { mutate: uploadMedia } = useUploadMedia();
  // const { mutate: deleteMedia } = useDeleteMedia();

  // const { data: stationMedia, isLoading: isMediaLoading } =
  //   useGetDrillStationMedia(station.id);

  const handleToggleDuration = useCallback(
    (show: boolean) => {
      setShowDuration(show);
      updateDrillStation({
        duration: duration,
        comments: comments,
        despcription: description,
        name: stationName,
        station_id: station.id,
        show_duration: show,
        show_comments: showComments,
        show_media: showMedia,
        show_edit_media: editMedia,
      });
    },
    [
      duration,
      comments,
      description,
      stationName,
      station.id,
      showComments,
      showMedia,
      editMedia,
      updateDrillStation,
    ],
  );

  const handleDeleteStation = useCallback(() => {
    const deleteMedia = true;
    deleteDrillStation({ station_id: station.id, deleteMedia });
  }, [deleteDrillStation, station]);

  const handleDeleteMedia = useCallback(
    (name: string) => {
      deleteMedia({ name, station_id: station.id });
    },
    [deleteMedia, station.id],
  );

  const handleDurationChange = useCallback(
    (newDuration: string) => {
      setDuration(newDuration);
      updateDrillStation({
        duration: newDuration,
        comments: comments,
        despcription: description,
        name: stationName,
        station_id: station.id,
        show_duration: showDuration,
        show_comments: showComments,
        show_media: showMedia,
        show_edit_media: editMedia,
      });
    },
    [
      comments,
      description,
      stationName,
      station.id,
      showDuration,
      showComments,
      showMedia,
      editMedia,
      updateDrillStation,
    ],
  );

  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const file = e.target.files[0];
        if (file) {
          uploadMedia({ station_id: station.id, file: file });
        } else {
          alert("no file found");
        }
      }
      e.target.value = "";
    },
    [uploadMedia, station],
  );

  const handleToggleComments = useCallback(
    (show: boolean) => {
      setShowComments(show);
      updateDrillStation({
        duration: duration,
        comments: comments,
        despcription: description,
        name: stationName,
        station_id: station.id,
        show_duration: showDuration,
        show_comments: show,
        show_media: showMedia,
        show_edit_media: editMedia,
      });
    },
    [
      duration,
      comments,
      description,
      stationName,
      station.id,
      showDuration,
      showMedia,
      editMedia,
      updateDrillStation,
    ],
  );

  const handleToggleShowMedia = useCallback(
    (show: boolean) => {
      setShowMedia(show);
      updateDrillStation({
        duration: duration,
        comments: comments,
        despcription: description,
        name: stationName,
        station_id: station.id,
        show_duration: showDuration,
        show_comments: showComments,
        show_media: show,
        show_edit_media: editMedia,
      });
    },
    [
      duration,
      comments,
      description,
      stationName,
      station.id,
      showDuration,
      showComments,
      editMedia,
      updateDrillStation,
    ],
  );

  const handleToggleEditMedia = useCallback(
    (show: boolean) => {
      setEditMedia(show);
      updateDrillStation({
        duration: duration,
        comments: comments,
        despcription: description,
        name: stationName,
        station_id: station.id,
        show_duration: showDuration,
        show_comments: showComments,
        show_media: showMedia,
        show_edit_media: show,
      });
    },
    [
      duration,
      comments,
      description,
      stationName,
      station.id,
      showDuration,
      showComments,
      showMedia,
      updateDrillStation,
    ],
  );

  //---------------------------------------------
  //---------------------------------------------
  //---------------------------------------------

  return (
    <div
      className={
        "relative flex w-full flex-row px-10 py-2  print:px-2 print:py-1" +
        (isLast
          ? ""
          : " print:border-b-[1px] print:border-b-seperatorSecondary")
      }
    >
      <div className="flex flex-1">
        <DrillStationHeader
          editMedia={editMedia}
          onToggleShowComments={handleToggleComments}
          onToggleShowMedia={handleToggleShowMedia}
          onToggleEditMedia={handleToggleEditMedia}
          showComments={showComments}
          showMedia={showMedia}
          duration={duration}
          durationString={durationString}
          stationName={stationName}
          stationNameRef={stationNameRef}
          setStationName={setStationName}
          showSettingsModal={showSettingsModal}
          setShowSettingsModal={setShowSettingsModal}
          showDuration={showDuration}
          onToggleDuration={handleToggleDuration}
          hideDurationPicker={hideDurationPicker}
          handleDeleteStation={handleDeleteStation}
          handleDurationChange={handleDurationChange}
          setHideDurationPicker={setHideDurationPicker}
        />
      </div>
      <SingleDrill
        comments={comments}
        commentsRef={commentsRef}
        description={description}
        descriptionRef={descriptionRef}
        editMedia={editMedia}
        handleDeleteMedia={handleDeleteMedia}
        handleFileUpload={handleFileUpload}
        inputRef={inputRef}
        isMediaLoading={isMediaLoading}
        setComments={setComments}
        setDescription={setDescription}
        showComments={showComments}
        showMedia={showMedia}
        stationMedia={stationMedia}
        setShowComments={setShowComments}
      />
      <StationBottomBorder isLast={isLast} />
      <Spacer showOnPrint={false} />
    </div>
  );
};

export default DrillStation;
