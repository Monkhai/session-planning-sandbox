export type QKFStationsArgs = {
  session_id: string;
};

export type QKFDrillMediaArgs = {
  drill_id: number;
  session_id: string;
};

export type QKFAthletesArgs = {
  group_id: string;
};

export type QKFAthleteSessionsArgs = {
  athlete_id: string;
  group_id: string;
};

export type QKFGroupSessionArgs = {
  group_id: string;
};

export type QKFGroupsArgs = {};

export const queryKeyFactory = {
  groups: (): string[] => ["groups"],
  groupAthletes: ({ group_id }: QKFAthletesArgs): string[] => [
    "groups",
    group_id,
    "athletes",
  ],
  athleteSessions: ({
    athlete_id,
    group_id,
  }: QKFAthleteSessionsArgs): string[] => [
    "groups",
    group_id,
    "athletes",
    athlete_id,
    "sessions",
  ],

  groupSessions: ({ group_id }: QKFGroupSessionArgs): string[] => [
    "groups",
    group_id,
    "groupSessions",
  ],

  stations: ({ session_id }: QKFStationsArgs): string[] => [
    "sessions",
    session_id,
    "stations",
  ],

  drillMedia: ({ drill_id, session_id }: QKFDrillMediaArgs): string[] => [
    session_id,
    String(drill_id),
    "drillMedia",
  ],
};
