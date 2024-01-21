import { StationType } from "./types";

export type Skill = {
  id: number;
  skillOfStationId: number;
  station_id: number;
  name: string;
  repetitions: number;
  order: number;
  description: string;
  show_reps: boolean;
};

export type SkillStation = {
  id: number;
  name: string;
  duration: string;
  order: number;
  skills: Skill[];
  user_id: string;
  show_duration: boolean;
  type: StationType;
};

export type SkillFromDB = {
  id: number;
  name: string;
  repetitions: number;
  description: string;
  show_reps: boolean;
};
