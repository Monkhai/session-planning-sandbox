"use client";
import React, { useCallback, useState } from "react";
import useCreateSkill from "~/hooks/useCreateSkill";
import useDeleteSkillStation from "~/hooks/useDeleteSkillStation";
import useSkillStationStates from "~/hooks/useSkillStationStates";
import { SkillStationType } from "~/utils/types";
import StationHeader from "../StationHeader";
import Spacer from "../utility/Spacer";
import StationBottomBorder from "./StationBottomBorder";
import StationSkills from "./StationSkills";

interface Props {
  station: SkillStationType;
  isLast: boolean;
}

const SkillStation = ({ station, isLast }: Props) => {
  const [hideDurationPicker, setHideDurationPicker] = useState(true);

  const stationNameRef = React.useRef<HTMLTextAreaElement>(null);

  const {
    updateStation,
    setShowDuration,
    setDuration,
    durationString,
    duration,
    setStationName,
    showDuration,
    stationName,
    setShowEditModal,
    showEditModal,
    editSkills,
    setEditSkills,
  } = useSkillStationStates({ station, stationNameRef });

  const { mutate: createSkill } = useCreateSkill();
  const { mutate: deleteStation } = useDeleteSkillStation();

  const handleDurationChange = useCallback(
    (duration: string) => {
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
    },
    [stationName, showDuration, station],
  );

  const handleCreateSkill = useCallback(async () => {
    createSkill({
      station_id: station.id,
    });
  }, [station.id, createSkill]);

  const handleDeleteStation = useCallback(() => {
    deleteStation(station.id);
  }, [station.id, deleteStation]);

  const handleToggleDuration = useCallback(
    (show: boolean) => {
      setShowDuration(show);
      updateStation({
        station_id: station.id,
        duration: duration,
        name: stationName,
        show_duration: show,
      });
    },
    [station.id, duration, stationName],
  );

  return (
    <div className="relative flex w-full flex-row px-10 py-2 print:px-2 print:py-1">
      <div className="flex flex-1">
        <StationHeader
          duration={duration}
          durationString={durationString}
          handleDurationChange={handleDurationChange}
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

export default SkillStation;
