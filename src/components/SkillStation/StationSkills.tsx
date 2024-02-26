import { SkillStationWithSkillsType, SkillType, Station } from "~/utils/types";
import PlusIcon from "../icons/PlusIcon";
import SkillRow from "./SkillRow";
import { Reorder } from "framer-motion";
import { queryClient } from "Providers/ReactQueryProvider";
import { queryKeyFactory } from "~/utils/queryFactories";
import { SessionContext } from "~/context/SessionIdContext";
import { useContext } from "react";
import useUpdateSkillsOrder from "~/hooks/skillStationHooks/useUpdateSkillsOrder";

interface Props {
  station: SkillStationWithSkillsType;
  onCreateSkill: () => void;
  editSkills: boolean;
}

const StationSkills = ({ editSkills, onCreateSkill, station }: Props) => {
  const { session_id } = useContext(SessionContext);
  const { mutate: updateSkillsOrder } = useUpdateSkillsOrder();

  const handleReorder = (newSkills: SkillType[]) => {
    const queryKey = queryKeyFactory.stations({ session_id });

    const stations: Station[] = queryClient.getQueryData(queryKey) ?? [];

    const newStation = {
      ...station,
      skills: newSkills,
    };

    const newStations = stations.map((station) => {
      if (station.id === newStation.id) {
        return newStation;
      }
      return station;
    });

    queryClient.setQueryData(queryKey, newStations);
  };

  const handleReorderEnd = () => {
    if (station.skills) {
      updateSkillsOrder({ session_id, skills: station.skills });
    }
  };

  return (
    <Reorder.Group
      values={station.skills}
      axis="y"
      onReorder={(newSkills) => handleReorder(newSkills)}
      className="flex w-full flex-col  md:w-1/2 "
    >
      {station.skills &&
        station.skills.map((skill, index) => (
          <SkillRow
            onReorderEnd={handleReorderEnd}
            index={index}
            skill={skill}
            editSkills={editSkills}
            key={skill.id}
            isLast={station.skills.length - 1 == index}
          />
        ))}
      <button
        onClick={onCreateSkill}
        className="my-4 self-center transition-all duration-150 active:scale-95 print:hidden"
      >
        <PlusIcon color={"blue"} size={30} />
      </button>
    </Reorder.Group>
  );
};

export default StationSkills;
