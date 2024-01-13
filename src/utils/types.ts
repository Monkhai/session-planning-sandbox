export type SkillType = {
  id: number;
  station_id: number;
  name: string;
  repetitions: number;
  order: number;
  description: string;
  user_id: string;
};

export type SkillStationType = {
  id: number;
  name: string;
  duration: string;
  order: number;
  skills: SkillType[];
  user_id: string;
  show_duration: boolean;
  type: "SkillStation" | "drillStation";
};

export type drillStationType = {
  id: number;
  user_id: string;
  name: string;
  duration: string;
  show_duration: boolean;
  description: string;
  comments: string;
  show_comments: boolean;
  order: number;
  mediaUrls: SignedUrls[];
  show_media: boolean;
  type: "SkillStation" | "drillStation";
};

export type DrillStationNoUrls = {
  id: number;
  user_id: string;
  name: string;
  duration: string;
  show_duration: boolean;
  description: string;
  comments: string;
  show_comments: boolean;
  order: number;
  show_media: boolean;
  type: "SkillStation" | "drillStation";
};

export type SignedUrls = {
  url: string;
  type: string;
  dimensions: ImageDimensions;
};

export type SignedUrlList = {
  drill_id: number;
  signedUrls: SignedUrls[];
};

export type CreateStationArgs = {};

export type UpdateStationNameArgs = {
  station_id: number;
  stationName: string;
};

export type updateStationArgs = {
  station_id: number;
  name: string;
  duration: string | null;
  show_duration: boolean;
};

export type CreateSkillArgs = {
  station_id: number;
};

export type updateSkillArgs = {
  skill_id: number;
  name: string;
  repetitions: number;
  description: string;
};

export type UpdateDrillStationArgs = {
  station_id: number;
  duration: string | null;
  name: string;
  show_duration: boolean;
  despcription: string;
  comments: string;
  show_comments: boolean;
  show_media: boolean;
};

export type Station = SkillStationType | drillStationType;

export type ImageDimensions = { height: number; width: number };
