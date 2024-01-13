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
  const [durationString, setDurationString] = useState<string | undefined>();
  const [stationName, setStationName] = useState<string>("");
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDurationPicker, setShowDurationPicker] = useState<boolean>(false);
  const [editSkills, setEditSkills] = useState<boolean>(false);

  const stationNameRef = React.useRef<HTMLInputElement>(null);

  const { mutate: createSkill } = useCreateSkill();
  const { mutate: deleteStation } = useDeleteSkillStation();
  const { mutate: updateStation } = useUpdateSkillStation();

  useEffect(() => {
    setDuration(station.duration);
  }, [station.duration]);

  useEffect(() => {
    setShowDurationPicker(station.show_duration);
  }, [station.show_duration]);

  useEffect(() => {
    setStationName(station.name);
  }, [station.name]);

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
          show_duration: showDurationPicker,
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
        show_duration: showDurationPicker,
      });
    } else {
      updateStation({
        station_id: station.id,
        duration: null,
        name: stationName,
        show_duration: showDurationPicker,
      });
    }
  }, []);

  const onHideDurationPicker = useCallback(() => {
    setHideDurationPicker(true);
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
    setShowDurationPicker(show);
    updateStation({
      station_id: station.id,
      duration: duration,
      name: stationName,
      show_duration: show,
    });
  };

  return (
    <div className="relative flex w-full flex-row px-20 py-2 print:py-1">
      <div className="flex flex-1 px-2">
        <StationHeader
          duration={duration}
          durationString={durationString}
          handleDurationChange={handledurationChange}
          hideDurationPicker={hideDurationPicker}
          setHideDurationPicker={setHideDurationPicker}
          setShowSettingsModal={setShowEditModal}
          setStationName={setStationName}
          showDuration={showDurationPicker}
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
