import { SessionFromDB } from "~/utils/types";
import Loader from "../Loader";
import GroupSessionRow from "./GroupSessionRow";

interface Props {
  sessions: SessionFromDB[] | undefined;
  areSessionsLoading: boolean;
}

const GroupSessionsList = ({ sessions, areSessionsLoading }: Props) => {
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

  if (sessions) {
    return (
      <div className="flex w-3/4 flex-col gap-2 pt-4 md:w-1/2 md:gap-4">
        <h2>General Sessions</h2>
        <div>
          {sessions.map((session, index) => {
            const lastSession = sessions[sessions.length - 1];
            const isLast =
              (lastSession && session.id === lastSession.id) || false;
            return (
              <GroupSessionRow
                key={session.id}
                session={session}
                index={index}
                isLast={isLast}
              />
            );
          })}
        </div>
      </div>
    );
  }

  return null;
};

export default GroupSessionsList;
