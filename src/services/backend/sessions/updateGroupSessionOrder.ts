import { SessionWithOrder } from "~/utils/types";
import updateSession from "./updateSession";

export default async (sessions: SessionWithOrder[]) => {
  try {
    const updatedSessions = Promise.all(
      sessions.map(async (session, index) => {
        if (session.order !== index + 1) {
          const newSession = await updateSession(
            session.id,
            session.name,
            index + 1,
          );

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
