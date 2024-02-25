import { SessionWithOrder } from "~/utils/types";
import Loader from "../Loader";
import GroupSessionRow from "./GroupSessionRow";
import { Reorder } from "framer-motion";
import useUpdateGroupSessionOrder from "~/hooks/groupSessionHooks/useUpdateGroupSessionOrder";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";

interface Props {
  sessions: SessionWithOrder[] | undefined;
  areSessionsLoading: boolean;
}

const GroupSessionsList = ({ sessions, areSessionsLoading }: Props) => {
  const [mutableSessions, setMutableSessions] = React.useState<
    SessionWithOrder[]
  >(sessions || []);

  useEffect(() => {
    setMutableSessions(sessions || []);
  }, [sessions]);

  const { mutate: updateGroupSessionOrder } = useUpdateGroupSessionOrder();
  const { group_id } = useParams<{ group_id: string }>();
  if (areSessionsLoading) {
    return (
      <div className="mt-4 flex h-full w-full flex-1 items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (sessions && sessions.length === 0) {
    return (
      <div className="mt-24 flex h-full w-full flex-1 items-center justify-center">
        <h3 className="text-xl font-semibold">
          Create a New General Session to Start!
        </h3>
      </div>
    );
  }

  const handleReorder = (newGroupSessions: SessionWithOrder[]) => {
    setMutableSessions(newGroupSessions);
  };

  const onReorderEnd = () => {
    updateGroupSessionOrder({ sessions: mutableSessions, group_id: group_id });
  };

  if (sessions) {
    return (
      <div className="flex w-3/4 flex-col gap-2 pt-4 md:w-1/2 md:gap-4">
        <h2>General Sessions</h2>
        <Reorder.Group values={sessions} onReorder={handleReorder} axis="y">
          {mutableSessions.map((session, index) => {
            const lastSession = sessions[sessions.length - 1];

            const isLast =
              (lastSession && session.id === lastSession.id) || false;

            return (
              <GroupSessionRow
                handleReorderEnd={onReorderEnd}
                key={session.id}
                session={session}
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

export default GroupSessionsList;
