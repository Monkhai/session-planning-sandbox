import { AthleteFromDB } from "~/utils/types";
import AthleteRow from "./AthleteRow";
import Loader from "../Loader";

interface Props {
  athletes: AthleteFromDB[] | undefined;
  areAthletesLoading: boolean;
}

const AthleteList = ({ athletes, areAthletesLoading }: Props) => {
  if (areAthletesLoading) {
    return (
      <div className="mt-4 flex h-full w-full flex-1 items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (athletes && athletes.length === 0) {
    return (
      <div className="mt-24 flex h-full w-full flex-1 items-center justify-center">
        <h3 className="text-xl font-semibold">
          Create a New Athlete to Start!
        </h3>
      </div>
    );
  }

  if (athletes) {
    return (
      <div className="flex w-3/4 flex-col gap-1 pt-4 md:w-1/2 md:gap-4">
        <h2>Athletes</h2>
        {athletes.map((athlete, index) => {
          const lastAthlete = athletes[athletes.length - 1];
          const isLast =
            (lastAthlete && athlete.id === lastAthlete.id) || false;
          return (
            <AthleteRow
              key={athlete.id}
              athlete={athlete}
              index={index}
              isLast={isLast}
            />
          );
        })}
      </div>
    );
  }
};

export default AthleteList;
