import { useEffect, useState } from "react";
import { Station, DrillStationType } from "~/utils/types";
import useUpdateDrillStation from "./useUpdateDrillStation";
import { convertDurationToString } from "~/services/DurationFunctions";

type useDrillStationStatesArgs = {
  station: DrillStationType;
  stationNameRef: React.RefObject<HTMLInputElement>;
  descriptionRef: React.RefObject<HTMLTextAreaElement>;
  commentsRef: React.RefObject<HTMLTextAreaElement>;
};

const useDrillStationStates = ({
  station,
  commentsRef,
  descriptionRef,
  stationNameRef,
}: useDrillStationStatesArgs) => {
  const [stationName, setStationName] = useState(station.name);
  const [duration, setDuration] = useState(station.duration);
  const [comments, setComments] = useState(station.comments);
  const [description, setDescription] = useState(station.description);
  const [showDuration, setShowDuration] = useState(station.show_duration);
  const [showComments, setShowComments] = useState(station.show_comments);
  const [showMedia, setShowMedia] = useState(station.show_media);
  const [editMedia, setEditMedia] = useState(station.show_edit_media);
  const [durationString, setDurationString] = useState<string | undefined>();

  const { mutate: updateDrillStation } = useUpdateDrillStation();

  useEffect(() => {
    setDuration(station.duration);
  }, [station.duration]);

  useEffect(() => {
    setShowDuration(station.show_duration);
  }, [station.show_duration]);

  useEffect(() => {
    setStationName(station.name);
  }, [station.name]);

  useEffect(() => {
    setComments(station.comments);
  }, [station.comments]);

  useEffect(() => {
    setDescription(station.description);
  }, [station.description]);

  useEffect(() => {
    setShowMedia(station.show_media);
  }, [station.show_media]);

  useEffect(() => {
    setShowComments(station.show_comments);
  }, [station.show_comments]);

  useEffect(() => {
    setEditMedia(station.show_edit_media);
  }, [station.show_edit_media]);

  useEffect(() => {
    const handleBlur = () => {
      if (
        stationName !== station.name ||
        duration !== station.duration ||
        comments !== station.comments ||
        description !== station.description ||
        showDuration !== station.show_duration ||
        showComments !== station.show_comments ||
        showMedia !== station.show_media
      ) {
        updateDrillStation({
          duration: duration,
          comments: comments,
          despcription: description,
          name: stationName,
          station_id: station.id,
          show_duration: showDuration,
          show_comments: showComments,
          show_media: showMedia,
          show_edit_media: editMedia,
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
    stationName,
    station,
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
    stationName,
    setStationName,
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
export default useDrillStationStates;
