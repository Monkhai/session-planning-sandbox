import React from "react";
import { SessionFromDB } from "~/utils/types";
import SessionRow from "./SessionRow";

interface Props {
  sessions: SessionFromDB[] | null;
}

const SessionList = ({ sessions }: Props) => {
  if (!sessions) {
    return null;
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

  return (
    <div className="flex w-3/4 flex-col pt-4 md:w-1/2">
      {sessions.map((session, index) => {
        const lastSession = sessions[sessions.length - 1];
        const isLast = (lastSession && session.id === lastSession.id) || false;
        return (
          <SessionRow
            key={session.id}
            session={session}
            index={index}
            isLast={isLast}
          />
        );
      })}
    </div>
  );
};

export default SessionList;
