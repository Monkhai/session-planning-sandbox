import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { SessionContext } from "~/context/SessionIdContext";
import useCreateDrill from "~/hooks/drillStationHooks/useCreateDrill";
import useDeleteDrillStation from "~/hooks/drillStationHooks/useDeleteDrillStation";
import useUpdateDrillStation from "~/hooks/drillStationHooks/useUpdateDrillStation";
import { convertDurationToString } from "~/services/DurationFunctions";
import { DrillStationWithDrillsType, DrillType, Station } from "~/utils/types";
import StationBottomBorder from "../SkillStation/StationBottomBorder";
import { CircuitDrill } from "./CircuitDrill";
import CircuitStationHeader from "./CircuitStationHeader";
import { Reorder, useDragControls } from "framer-motion";
import { queryKeyFactory } from "~/utils/queryFactories";
import { queryClient } from "Providers/ReactQueryProvider";
import useUpdateDrillsOrder from "~/hooks/drillStationHooks/useUpdateDrillsOrder";

interface Props {
  station: DrillStationWithDrillsType;
  isLast: boolean;
  onReorderEnd: () => void;
}

const CircuitStation = ({ station, isLast, onReorderEnd }: Props) => {
  const [showDurationPicker, setShowDurationPicker] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);

  const [showDuration, setShowDuration] = useState<boolean>(
    station.show_duration,
  );

  const [duration, setDuration] = useState<string>(station.duration);
  const [stationName, setStationName] = useState<string>(station.name);

  const { session_id } = useContext(SessionContext);

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
  const { mutate: updateDrillsOrder } = useUpdateDrillsOrder();
  const handleToggleDuration = useCallback(
    (show: boolean) => {
      setShowDuration(show);
      updateDrillStation({
        duration: duration,
        name: stationName,
        station_id: station.id,
        show_duration: show,
        session_id: session_id,
        order: station.order,
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
          order: station.order,
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
        order: station.order,
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

  const dragControls = useDragControls();

  const handleDrillReorder = (drills: DrillType[]) => {
    const queryKey = queryKeyFactory.stations({ session_id });
    const previousStations: Station[] =
      queryClient.getQueryData(queryKey) ?? [];

    const newStation = {
      ...station,
      drills,
    };

    const newStations = previousStations.map((station) => {
      if (station.id === newStation.id) {
        return newStation;
      }
      return station;
    });

    queryClient.setQueryData(queryKey, newStations);
  };

  const handleDrillReorderEnd = () => {
    updateDrillsOrder({ drills: station.drills, session_id });
  };

  return (
    <Reorder.Item
      value={station}
      dragControls={dragControls}
      dragListener={false}
      key={station.id}
      onDragEnd={onReorderEnd}
      className={
        "relative flex w-full flex-col px-2 py-2 print:px-2 print:py-1  md:flex-row md:px-10" +
        (isLast
          ? ""
          : " print:border-b-[1px] print:border-b-seperatorSecondary")
      }
    >
      <div className="flex flex-1">
        <CircuitStationHeader
          dragControls={dragControls}
          onAddDrill={handleAddDrill}
          duration={duration}
          handleDurationChange={handleDurationChange}
          handleDeleteStation={handleDeleteStation}
          showDurationPicker={showDurationPicker}
          setShowDurationPicker={setShowDurationPicker}
          onToggleDuration={handleToggleDuration}
          setStationName={setStationName}
          setShowSettingsModal={setShowSettingsModal}
          showDuration={showDuration}
          showSettingsModal={showSettingsModal}
          stationName={stationName}
          stationNameRef={stationNameRef}
          durationString={durationString}
        />
      </div>
      <Reorder.Group
        values={station.drills}
        axis="y"
        onReorder={handleDrillReorder}
        className="flex flex-1 flex-col gap-4 md:flex-[3] md:gap-6"
      >
        {station.drills.map((drill) => (
          <CircuitDrill
            onReorderEnd={handleDrillReorderEnd}
            key={drill.id}
            drill={drill}
          />
        ))}
      </Reorder.Group>
      <StationBottomBorder isLast={isLast} />
    </Reorder.Item>
  );
};

export default CircuitStation;
