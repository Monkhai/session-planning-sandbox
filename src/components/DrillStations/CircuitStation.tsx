import { useCallback, useRef, useState } from "react";
import useDeleteDrillStation from "~/hooks/drillStationHooks/useDeleteDrillStation";
import useUpdateDrillStation from "~/hooks/drillStationHooks/useUpdateDrillStation";
import { DrillStationWithDrillsType } from "~/utils/types";
import StationBottomBorder from "../SkillStation/StationBottomBorder";
import Spacer from "../utility/Spacer";
import DrillStationHeader from "./DrillStationHeader";

interface Props {
  station: DrillStationWithDrillsType;
  isLast: boolean;
}

const CircuitStation = ({ station, isLast }: Props) => {
  const [hideDurationPicker, setHideDurationPicker] = useState(true);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);

  const [showDuration, setShowDuration] = useState<boolean>(
    station.show_duration,
  );

  const [duration, setDuration] = useState<string>(station.duration);
  const [stationName, setStationName] = useState<string>(station.name);

  const stationNameRef = useRef<HTMLTextAreaElement>(null);

  const { mutate: deleteDrillStation } = useDeleteDrillStation();
  const { mutate: updateDrillStation } = useUpdateDrillStation();

  const handleToggleDuration = useCallback(
    (show: boolean) => {
      setShowDuration(show);
      updateDrillStation({
        duration: duration,
        name: stationName,
        station_id: station.id,
        show_duration: show,
      });
    },
    [duration, stationName, station.id, updateDrillStation],
  );

  const handleDeleteStation = useCallback(() => {
    const deleteMedia = true;
    const drillsId = station.drills.map((drill) => drill.id);
    deleteDrillStation({ station_id: station.id, deleteMedia, drillsId });
  }, [deleteDrillStation, station]);

  const handleDurationChange = useCallback(
    (newDuration: string) => {
      setDuration(newDuration);
      updateDrillStation({
        duration: newDuration,
        name: stationName,
        station_id: station.id,
        show_duration: showDuration,
      });
    },
    [stationName, station.id, showDuration, updateDrillStation],
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
          stationNameRef={stationNameRef}
          duration={duration}
          stationName={stationName}
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

      <StationBottomBorder isLast={isLast} />
      <Spacer showOnPrint={false} />
    </div>
  );
};

export default CircuitStation;
