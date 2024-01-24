import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useDeleteDrillStation from "~/hooks/drillStationHooks/useDeleteDrillStation";
import useUpdateDrillStation from "~/hooks/drillStationHooks/useUpdateDrillStation";
import { convertDurationToString } from "~/services/DurationFunctions";
import { DrillStationWithDrillsType } from "~/utils/types";
import StationBottomBorder from "../SkillStation/StationBottomBorder";
import Spacer from "../utility/Spacer";
import CircuitStationHeader from "./CircuitStationHeader";
import { CircuitDrill } from "./CircuitDrill";

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

  const durationString = useMemo(() => {
    const newDurationString = convertDurationToString(duration);
    if (newDurationString) {
      if (newDurationString[0] == "0") {
        setDuration("00:00:00");
        return "";
      } else {
        return newDurationString;
      }
    } else {
      return "";
    }
  }, [duration]);

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

  useEffect(() => {
    const handleBlur = () => {
      if (stationName !== station.name) {
        updateDrillStation({
          duration: duration,
          name: stationName,
          station_id: station.id,
          show_duration: showDuration,
        });
      }
    };

    stationNameRef.current?.addEventListener("blur", handleBlur);

    return () => {
      stationNameRef.current?.removeEventListener("blur", handleBlur);
    };
  }, [stationName, station.id, duration, showDuration, updateDrillStation]);

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
        <CircuitStationHeader
          duration={duration}
          handleDurationChange={handleDurationChange}
          handleDeleteStation={handleDeleteStation}
          hideDurationPicker={hideDurationPicker}
          onToggleDuration={handleToggleDuration}
          setHideDurationPicker={setHideDurationPicker}
          setStationName={setStationName}
          setShowSettingsModal={setShowSettingsModal}
          showDuration={showDuration}
          showSettingsModal={showSettingsModal}
          stationName={stationName}
          stationNameRef={stationNameRef}
          durationString={durationString}
        />
      </div>
      <div className="flex flex-[3] flex-col gap-6">
        {station.drills.map((drill) => (
          <CircuitDrill drill={drill} />
        ))}
      </div>
      <StationBottomBorder isLast={isLast} />
      {/* <Spacer showOnPrint={false} /> */}
    </div>
  );
};

export default CircuitStation;
