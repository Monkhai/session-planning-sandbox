"use client";
import React, { useCallback, useEffect, useState } from "react";
import useCreateSkill from "~/hooks/useCreateSkill";
import useDeleteSkillStation from "~/hooks/useDeleteSkillStation";
import useUpdateSkillStation from "~/hooks/useUpdateSkillStation";
import { SkillStationType } from "~/utils/types";
import StationBottomBorder from "./StationBottomBorder";
import StationHeader from "../StationHeader";
import StationSkills from "./StationSkills";
import Spacer from "../utility/Spacer";
import { convertDurationToString } from "~/services/DurationFunctions";

interface Props {
  station: SkillStationType;
  isLast: boolean;
}

const SkillStation = ({ station, isLast }: Props) => {
  const [hideDurationPicker, setHideDurationPicker] = useState(true);
  const [duration, setDuration] = useState<string>("00:00:00");
  const [durationString, setDurationString] = useState<string | undefined>(
    station.duration ? convertDurationToString(station.duration) : undefined,
  );
  const [stationName, setStationName] = useState<string>(station.name ?? "");
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDuration, setShowDuration] = useState<boolean>(
    station.show_duration ?? false,
  );
  const [editSkills, setEditSkills] = useState<boolean>(false);

  const stationNameRef = React.useRef<HTMLInputElement>(null);

  const { mutate: createSkill } = useCreateSkill();
  const { mutate: deleteStation } = useDeleteSkillStation();
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
  }, [stationName, station]);

  const handledurationChange = useCallback((duration: string) => {
    setDuration(duration);
    if (duration) {
      updateStation({
        station_id: station.id,
        duration: duration,
        name: stationName,
        show_duration: showDuration,
      });
    } else {
      updateStation({
        station_id: station.id,
        duration: null,
        name: stationName,
        show_duration: showDuration,
      });
    }
  }, []);

  const handleCreateSkill = async () => {
    createSkill({
      station_id: station.id,
    });
  };

  const handleDeleteStation = () => {
    deleteStation(station.id);
  };

  const handleToggleDuration = (show: boolean) => {
    setShowDuration(show);
    updateStation({
      station_id: station.id,
      duration: duration,
      name: stationName,
      show_duration: show,
    });
  };

  return (
    <div className="relative z-0 flex w-full flex-row px-10 py-2 print:px-2 print:py-1">
      <div className="flex flex-1">
        <StationHeader
          duration={duration}
          durationString={durationString}
          handleDurationChange={handledurationChange}
          hideDurationPicker={hideDurationPicker}
          setHideDurationPicker={setHideDurationPicker}
          setShowSettingsModal={setShowEditModal}
          setStationName={setStationName}
          showDuration={showDuration}
          showSettingsModal={showEditModal}
          stationName={stationName}
          stationNameRef={stationNameRef}
          handleDeleteStation={handleDeleteStation}
          onToggleDuration={handleToggleDuration}
          setEditSkills={setEditSkills}
        />
      </div>
      {/*  */}
      <StationSkills
        editSkills={editSkills}
        onCreateSkill={handleCreateSkill}
        station={station}
      />
      {/*  */}
      <StationBottomBorder isLast={isLast} />
      <Spacer />
    </div>
  );
};

export default React.memo(SkillStation);
