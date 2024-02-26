import { AthleteFromDB, AthleteWithOrder } from "~/utils/types";
import AthleteRow from "./AthleteRow";
import Loader from "../Loader";
import { Reorder } from "framer-motion";
import useUpdateAthletesOrder from "~/hooks/athletesHooks/useUpdateAthletesOrder";
import { useParams } from "next/navigation";
import { on } from "events";
import React, { useEffect } from "react";
import { queryKeyFactory } from "~/utils/queryFactories";
import { queryClient } from "Providers/ReactQueryProvider";

interface Props {
  athletes: AthleteWithOrder[] | undefined;
  areAthletesLoading: boolean;
}

const AthleteList = ({ athletes, areAthletesLoading }: Props) => {
  const { mutate: updateAthletesOrder } = useUpdateAthletesOrder();
  const { group_id } = useParams<{ group_id: string }>();
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

  const handleReorder = (newAthletes: AthleteWithOrder[]) => {
    const queryKey = queryKeyFactory.groupAthletes({ group_id });
    queryClient.setQueryData(queryKey, newAthletes);
  };

  const onReorderEnd = () => {
    if (athletes) {
      updateAthletesOrder({ athletes: athletes, group_id: group_id });
    }
  };

  if (athletes !== undefined && athletes.length > 0) {
    return (
      <div className="flex w-3/4 flex-col gap-2 pt-4 md:w-1/2 md:gap-4">
        <h2>Athletes</h2>
        <Reorder.Group values={athletes} axis="y" onReorder={handleReorder}>
          {athletes.map((athlete, index) => {
            const lastAthlete = athletes[athletes.length - 1];
            const isLast =
              (lastAthlete && athlete.id === lastAthlete.id) || false;
            return (
              <AthleteRow
                handleReorderEnd={onReorderEnd}
                key={athlete.id}
                athlete={athlete}
                index={index}
                isLast={isLast}
              />
            );
          })}
        </Reorder.Group>
      </div>
    );
  }

  return null;
};

export default AthleteList;
