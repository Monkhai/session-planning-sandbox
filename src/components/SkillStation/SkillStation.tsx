"use client";
import React, { useCallback, useState } from "react";
import useCreateSkill from "~/hooks/skillStationHooks/useCreateSkill";
import useDeleteSkillStation from "~/hooks/skillStationHooks/useDeleteSkillStation";
import useSkillStationStates from "~/hooks/skillStationHooks/useSkillStationStates";
import { SkillStationWithSkillsType } from "~/utils/types";
import StationHeader from "../StationHeader";
import Spacer from "../utility/Spacer";
import StationBottomBorder from "./StationBottomBorder";
import StationSkills from "./StationSkills";
import useAutoResizeTextarea from "~/hooks/useAutoResizeTextArea";
import { useParams } from "next/navigation";

interface Props {
  station: SkillStationWithSkillsType;
  isLast: boolean;
}

const SkillStation = ({ station, isLast }: Props) => {
  const [hideDurationPicker, setHideDurationPicker] = useState(true);

  const stationNameRef = React.useRef<HTMLTextAreaElement>(null);
  const params = useParams<{ id: string }>();

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
  } = useSkillStationStates({ station, stationNameRef, session_id: params.id });

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
          session_id: params.id,
        });
      } else {
        updateStation({
          station_id: station.id,
          duration: null,
          name: stationName,
          show_duration: showDuration,
          session_id: params.id,
        });
      }
    },
    [stationName, showDuration, station, params.id],
  );

  const handleCreateSkill = useCallback(async () => {
    createSkill({
      station_id: station.id,
      lastOrder: station.skills ? station.skills.length : 0,
      session_id: params.id,
    });
  }, [station, createSkill, params.id]);

  const handleDeleteStation = useCallback(() => {
    deleteStation({
      station_id: station.id,
      skills: station.skills,
      session_id: params.id,
    });
  }, [station.id, deleteStation, station.skills, params.id]);

  const handleToggleDuration = useCallback(
    (show: boolean) => {
      setShowDuration(show);
      updateStation({
        station_id: station.id,
        duration: duration,
        name: stationName,
        show_duration: show,
        session_id: params.id,
      });
    },
    [station.id, duration, stationName, params.id],
  );

  return (
    <div
      className={
        "relative flex w-full flex-col px-2 py-2 print:px-2 print:py-1 md:flex-row md:px-10" +
        (isLast
          ? ""
          : " print:border-b-[1px] print:border-b-seperatorSecondary")
      }
    >
      <div className="flex md:flex-1">
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

      <StationSkills
        editSkills={editSkills}
        onCreateSkill={handleCreateSkill}
        station={station}
      />

      <StationBottomBorder isLast={isLast} />
      <Spacer />
    </div>
  );
};

export default SkillStation;
