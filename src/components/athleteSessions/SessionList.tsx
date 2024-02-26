import { SessionWithOrder } from "~/utils/types";
import Loader from "../Loader";
import SessionRow from "./SessionRow";
import { Reorder } from "framer-motion";
import { queryKeyFactory } from "~/utils/queryFactories";
import { useParams } from "next/navigation";
import { queryClient } from "Providers/ReactQueryProvider";
import useUpdateAthleteSessionsOrder from "~/hooks/athletesHooks/useUpdateAthleteSessionsOrder";

interface Props {
  sessions: SessionWithOrder[] | undefined;
  areSessionsLoading: boolean;
}

const SessionList = ({ sessions, areSessionsLoading }: Props) => {
  const { group_id, athlete_id } = useParams<{
    athlete_id: string;
    group_id: string;
  }>();

  const { mutate: updateAthleteSessionsOrder } =
    useUpdateAthleteSessionsOrder();

  if (areSessionsLoading) {
    return (
      <div className="mt-4 flex h-full w-full flex-1 items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (sessions && sessions.length === 0) {
    return (
      <div className="flex h-full w-full flex-1 items-center justify-center">
        <h3 className="text-xl font-semibold">
          Create a New Session to Start!
        </h3>
      </div>
    );
  }

  const handleReorder = (newSessions: SessionWithOrder[]) => {
    const queryKey = queryKeyFactory.athleteSessions({
      athlete_id,
      group_id,
    });

    queryClient.setQueryData(queryKey, newSessions);
  };

  const handleReorderEnd = () => {
    if (sessions) {
      updateAthleteSessionsOrder({
        sessions: sessions,
        group_id,
        athlete_id,
      });
    }
  };

  if (sessions) {
    return (
      <Reorder.Group
        values={sessions}
        axis="y"
        onReorder={(newSessions) => handleReorder(newSessions)}
        className="flex w-3/4 flex-col pt-4 md:w-1/2"
      >
        {sessions.map((session, index) => {
          const lastSession = sessions[sessions.length - 1];
          const isLast =
            (lastSession && session.id === lastSession.id) || false;
          return (
            <SessionRow
              onReorderEnd={handleReorderEnd}
              key={session.id}
              session={session}
              index={index}
              isLast={isLast}
            />
          );
        })}
      </Reorder.Group>
    );
  }

  return null;
};

export default SessionList;
