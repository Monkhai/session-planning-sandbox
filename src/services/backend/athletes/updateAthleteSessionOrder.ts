import { SessionWithOrder } from "~/utils/types";
import updateSession from "../sessions/updateSession";

export default async (sessions: SessionWithOrder[]) => {
  try {
    const updatedSessions = Promise.all(
      sessions.map(async (session, index) => {
        if (session.order !== index + 1) {
          const newSession = await updateSession({
            joinTable: "sessions_of_athletes",
            name: session.name,
            order: index + 1,
            session_id: session.id,
          });

          if (!newSession) {
            throw new Error("No data returned from sessions");
          }

          return newSession;
        } else {
          return session;
        }
      }),
    );

    return updatedSessions as Promise<SessionWithOrder[]>;
  } catch (error) {
    throw error;
  }
};
