export type SkillType = {
  id: number;
  station_id: number;
  name: string;
  repetitions: number;
  order: number;
  description: string;
  user_id: string;
};

export type StationType = "skillStation" | "drillStation";

export type SkillStationType = {
  id: number;
  name: string;
  duration: string;
  order: number;
  skills: SkillType[];
  user_id: string;
  show_duration: boolean;
  type: StationType;
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
  show_edit_media: boolean;
  type: StationType;
};

export type drillStationType = DrillStationNoUrls & { mediaUrls: SignedUrls[] };

export type Station = SkillStationType | drillStationType;

export type SignedUrls = {
  url: string;
  type: string;
  dimensions: ImageDimensions;
  name: string;
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
  station_id: number;
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
  show_edit_media: boolean;
};

export type ImageDimensions = { height: number; width: number };

export type UploadMediaArgs = {
  station_id: number;
  file: File;
};
