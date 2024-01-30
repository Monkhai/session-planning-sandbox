import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useDeleteDrillStation from "~/hooks/drillStationHooks/useDeleteDrillStation";
import useUpdateDrillStation from "~/hooks/drillStationHooks/useUpdateDrillStation";
import { convertDurationToString } from "~/services/DurationFunctions";
import { DrillStationWithDrillsType } from "~/utils/types";
import StationBottomBorder from "../SkillStation/StationBottomBorder";
import Spacer from "../utility/Spacer";
import CircuitStationHeader from "./CircuitStationHeader";
import { CircuitDrill } from "./CircuitDrill";
import useCreateDrill from "~/hooks/drillStationHooks/useCreateDrill";
import { useParams } from "next/navigation";

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
  const { mutate: addlDrillToCircuit } = useCreateDrill();

  const { id: session_id } = useParams<{ id: string }>();

  const handleToggleDuration = useCallback(
    (show: boolean) => {
      setShowDuration(show);
      updateDrillStation({
        duration: duration,
        name: stationName,
        station_id: station.id,
        show_duration: show,
        session_id: session_id,
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
          session_id: session_id,
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
    deleteDrillStation({
      station_id: station.id,
      deleteMedia,
      drillsId,
      session_id,
    });
  }, [deleteDrillStation, station]);

  const handleDurationChange = useCallback(
    (newDuration: string) => {
      setDuration(newDuration);
      updateDrillStation({
        duration: newDuration,
        name: stationName,
        station_id: station.id,
        show_duration: showDuration,
        session_id: session_id,
      });
    },
    [stationName, station.id, showDuration, updateDrillStation],
  );

  const handleAddDrill = useCallback(() => {
    addlDrillToCircuit({
      stationId: station.id,
      lastOrder: station.drills.length,
      session_id,
    });
  }, [station]);
  //---------------------------------------------
  //---------------------------------------------
  //---------------------------------------------

  return (
    <div
      className={
        "relative flex w-full flex-col px-2 py-2 print:px-2 print:py-1  md:flex-row md:px-10" +
        (isLast
          ? ""
          : " print:border-b-[1px] print:border-b-seperatorSecondary")
      }
    >
      <div className="flex flex-1">
        <CircuitStationHeader
          onAddDrill={handleAddDrill}
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
      <div className="flex flex-1 flex-col gap-4 md:flex-[3] md:gap-6">
        {station.drills.map((drill) => (
          <CircuitDrill key={drill.id} drill={drill} />
        ))}
      </div>
      <StationBottomBorder isLast={isLast} />
    </div>
  );
};

export default CircuitStation;
