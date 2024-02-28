import { useEffect, useState } from "react";
import { convertDurationToString } from "~/services/DurationFunctions";
import { SkillStationType } from "~/utils/types";
import useUpdateSkillStation from "./useUpdateSkillStation";

type useSkillStationStatesArgs = {
  station: SkillStationType;
  stationNameRef: React.RefObject<HTMLTextAreaElement>;
  session_id: string;
};

const useSkillStationStates = ({
  station,
  stationNameRef,
  session_id,
}: useSkillStationStatesArgs) => {
  const [stationName, setStationName] = useState(station.name);
  const [duration, setDuration] = useState(station.duration);
  const [showDuration, setShowDuration] = useState(station.show_duration);
  const [durationString, setDurationString] = useState<string | undefined>();
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editSkills, setEditSkills] = useState<boolean>(false);

  const { mutate: updateStation } = useUpdateSkillStation();

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
    setShowDuration(station.show_duration);
  }, [station.show_duration]);

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

  useEffect(() => {
    const handleBlur = () => {
      if (stationName !== station.name) {
        updateStation({
          station_id: station.id,
          duration: duration,
          name: stationName,
          show_duration: showDuration,
          session_id,
          order: station.order,
        });
      }
    };

    const element = stationNameRef.current;
    if (element) {
      element.addEventListener("blur", handleBlur);
    }

    return () => {
      if (element) {
        element.removeEventListener("blur", handleBlur);
      }
    };
  }, [
    stationName,
    station,
    stationNameRef,
    duration,
    showDuration,
    updateStation,
  ]);

  return {
    stationName,
    setStationName,
    duration,
    setDuration,
    showDuration,
    setShowDuration,
    durationString,
    showEditModal,
    setShowEditModal,
    editSkills,
    setEditSkills,
    updateStation,
  };
};

export default useSkillStationStates;
