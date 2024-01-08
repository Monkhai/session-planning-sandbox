export type Skill = {
  id: number;
  station_id: number;
  name: string;
  repetitions: number;
  order: number;
  user_id: string;
};

export type Station = {
  id: number;
  name: string;
  duration: string;
  order: number;
  skills: Skill[];
  user_id: string;
};

export type CreateStationArgs = {
  userId: string;
};

export type UpdateStationNameArgs = {
  station_id: number;
  stationName: string;
};

export type CreateSkillArgs = {
  user_id: string;
  station_id: number;
};
