export type SkillFromDBType = {
  id: number;
  name: string;
  repetitions: number;
  description: string;
  show_reps: boolean;
};

export type SkillType = {
  id: number;
  skillOfStationId: number;
  station_id: number;
  name: string;
  repetitions: number;
  order: number;
  description: string;
  show_reps: boolean;
};

export type StationType = "skillStation" | "drillStation";

export type SkillStationWithSkillsType = {
  id: number;
  name: string;
  duration: string;
  order: number;
  skills: SkillType[];
  user_id: string;
  show_duration: boolean;
  type: StationType;
};

export type SkillStationType = {
  id: number;
  name: string;
  duration: string;
  order: number;
  user_id: string;
  show_duration: boolean;
  type: StationType;
};

export type DrillFromDBType = {
  id: number;
  name: string;
  duration: string;
  show_duration: boolean;
  description: string;
  comments: string;
  show_comments: boolean;
  show_media: boolean;
  show_edit_media: boolean;
};

export type DrillType = {
  id: number;
  drillOfStationId: number;
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
  station_id: number;
};

export type DrillStationType = {
  id: number;
  user_id: string;
  name: string;
  duration: string;
  show_duration: boolean;
  order: number;
  type: StationType;
};

export type DrillStationWithDrillsType = DrillStationType & {
  drills: DrillType[];
};

export type Station = SkillStationWithSkillsType | DrillStationWithDrillsType;

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

export type updateStationArgs = {
  station_id: number;
  name: string;
  duration: string | null;
  show_duration: boolean;
};

export type CreateSkillArgs = {
  station_id: number;
  lastOrder: number;
};

export type updateSkillArgs = {
  skill_id: number;
  name: string;
  repetitions: number;
  description: string;
  station_id: number;
  show_reps: boolean;
};

export type UpdateDrillArgs = {
  drill_id: number;
  duration: string | null;
  name: string;
  show_duration: boolean;
  description: string;
  comments: string;
  show_comments: boolean;
  show_media: boolean;
  show_edit_media: boolean;
  station_id: number;
};

export type ImageDimensions = { height: number; width: number };

export type UploadMediaArgs = {
  station_id: number;
  file: File;
};

export type FolderWithSignedUrls = {
  drill_id: number;
  signedUrls: {
    url: string;
    type: string;
    dimensions: ImageDimensions;
    name: string;
  }[];
};

export type SkillList = {
  station_id: number;
  skillList: {
    id: number;
    skill_id: number;
    order: number;
  }[];
};

export type DrillList = {
  station_id: number;
  drillList: {
    id: number;
    drill_id: number;
    order: number;
  }[];
};

export type UpdateDrillStationArgs = {
  station_id: number;
  name: string;
  duration: string | null;
  show_duration: boolean;
};

export type SkillofSKillStation = {
  id: number;
  skill_id: number;
  skill_station_id: number;
  order: number;
};

export type DrillOfDrillStation = {
  id: number;
  drill_id: number;
  drill_station_id: number;
  order: number;
};
