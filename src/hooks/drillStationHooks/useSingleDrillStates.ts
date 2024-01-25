import { useEffect, useState } from "react";
import { Station, DrillStationType, DrillType } from "~/utils/types";
import useUpdateDrillStation from "./useUpdateDrillStation";
import { convertDurationToString } from "~/services/DurationFunctions";
import useUpdateDrill from "./useUpdateDrill";

type useDrillStationStatesArgs = {
  drill: DrillType;
  stationNameRef: React.RefObject<HTMLTextAreaElement>;
  descriptionRef: React.RefObject<HTMLTextAreaElement>;
  commentsRef: React.RefObject<HTMLTextAreaElement>;
};

const useSingleDrillState = ({
  drill,
  commentsRef,
  descriptionRef,
  stationNameRef,
}: useDrillStationStatesArgs) => {
  const [drillName, setDrillName] = useState(drill.name);
  const [duration, setDuration] = useState(drill.duration);
  const [comments, setComments] = useState(drill.comments);
  const [description, setDescription] = useState(drill.description);
  const [showDuration, setShowDuration] = useState(drill.show_duration);
  const [showComments, setShowComments] = useState(drill.show_comments);
  const [showMedia, setShowMedia] = useState(drill.show_media);
  const [editMedia, setEditMedia] = useState(drill.show_edit_media);
  const [durationString, setDurationString] = useState<string | undefined>();

  const { mutate: updateDrillStation } = useUpdateDrill();

  useEffect(() => {
    setDuration(drill.duration);
  }, [drill.duration]);

  useEffect(() => {
    setShowDuration(drill.show_duration);
  }, [drill.show_duration]);

  useEffect(() => {
    setDrillName(drill.name);
  }, [drill.name]);

  useEffect(() => {
    setComments(drill.comments);
  }, [drill.comments]);

  useEffect(() => {
    setDescription(drill.description);
  }, [drill.description]);

  useEffect(() => {
    setShowMedia(drill.show_media);
  }, [drill.show_media]);

  useEffect(() => {
    setShowComments(drill.show_comments);
  }, [drill.show_comments]);

  useEffect(() => {
    setEditMedia(drill.show_edit_media);
  }, [drill.show_edit_media]);

  useEffect(() => {
    const handleBlur = () => {
      if (
        drillName !== drill.name ||
        duration !== drill.duration ||
        comments !== drill.comments ||
        description !== drill.description ||
        showDuration !== drill.show_duration ||
        showComments !== drill.show_comments ||
        showMedia !== drill.show_media
      ) {
        updateDrillStation({
          comments,
          description,
          drill_id: drill.id,
          duration,
          name: drillName,
          show_comments: showComments,
          show_duration: showDuration,
          show_edit_media: editMedia,
          show_media: showMedia,
          station_id: drill.station_id,
        });
      }
    };

    const nameElement = stationNameRef.current;
    if (nameElement) {
      nameElement.addEventListener("blur", handleBlur);
    }

    const descriptionElement = descriptionRef.current;
    if (descriptionElement) {
      descriptionElement.addEventListener("blur", handleBlur);
    }

    const commentsElement = commentsRef.current;
    if (commentsElement) {
      commentsElement.addEventListener("blur", handleBlur);
    }

    return () => {
      if (nameElement) {
        nameElement.removeEventListener("blur", handleBlur);
      }
      if (descriptionElement) {
        descriptionElement.removeEventListener("blur", handleBlur);
      }
      if (commentsElement) {
        commentsElement.removeEventListener("blur", handleBlur);
      }
    };
  }, [
    drillName,
    drill,
    duration,
    comments,
    description,
    showDuration,
    showComments,
    showMedia,
  ]);

  useEffect(() => {
    const newDurationString = convertDurationToString(duration);
    if (newDurationString) {
      if (newDurationString[0] == "0") {
        setDurationString("");
        setDuration("00:00:00");
      } else {
        setDurationString(newDurationString);
      }
    } else {
      setDurationString("");
    }
  }, [duration]);

  return {
    drillName,
    setDrillName,
    duration,
    setDuration,
    comments,
    setComments,
    description,
    setDescription,
    showDuration,
    setShowDuration,
    showComments,
    setShowComments,
    showMedia,
    setShowMedia,
    editMedia,
    setEditMedia,
    durationString,
    setDurationString,
    updateDrillStation,
  };
};
export default useSingleDrillState;
