import { DrillStationWithDrillsType } from "~/utils/types";
import CircuitStation from "./CircuitStation";
import SingleDrillStation from "./SingleDrillStation";
interface Props {
  station: DrillStationWithDrillsType;
  isLast: boolean;
}
const DrillStationHandler = ({ station, isLast }: Props) => {
  if (station.drills.length === 1 && station.drills[0] !== undefined) {
    return <SingleDrillStation drill={station.drills[0]} isLast={isLast} />;
  }

  if (station.drills.length > 1) {
    return <CircuitStation station={station} isLast={isLast} />;
  }

  return null;
};

export default DrillStationHandler;
