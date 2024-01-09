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

export type CreateStationArgs = {};

export type UpdateStationNameArgs = {
  station_id: number;
  stationName: string;
};

export type CreateSkillArgs = {
  station_id: number;
};

export type updateSkillArgs = {
  skill_id: number;
  name: string;
  repetitions: number;
};
