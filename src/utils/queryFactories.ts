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

  specificGroup: ({ group_id }: { group_id: string }): string[] => [
    "groups",
    group_id,
  ],

  groupAthletes: ({ group_id }: QKFAthletesArgs): string[] => [
    "groups",
    group_id,
    "athletes",
  ],

  specificAthlete: ({
    athlete_id,
    group_id,
  }: QKFAthleteSessionsArgs): string[] => [
    "groups",
    group_id,
    "athletes",
    athlete_id,
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

  specificSession: ({ session_id }: { session_id: string }): string[] => [
    "sessions",
    session_id,
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
