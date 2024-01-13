import { PostgrestSingleResponse } from "@supabase/supabase-js";
import client from "~/utils/supabaseClient";
import {
  DrillStationNoUrls,
  SkillStationType,
  drillStationType,
  UpdateDrillStationArgs,
} from "~/utils/types";

export const getUserId = async () => {
  try {
    const { data } = await client.auth.getUser();
    const user_id = data.user?.id;
    if (!user_id) {
      throw new Error("No user id found");
    }
    return user_id;
  } catch (error) {
    console.log(error);
    throw new Error("No user id found");
  }
};

export const getSkillStations = async (): Promise<SkillStationType[]> => {
  const user_id = await getUserId();
  try {
    const response: PostgrestSingleResponse<SkillStationType[]> = await client
      .from("skill_stations")
      .select(
        `
                id,
                name,
                duration,
                order,
                user_id,
                show_duration,
                type,
                skills (
                  station_id,
                    id,
                    name,
                    repetitions,
                    order,
                    description,
                    user_id
                )
            `,
      )
      .order("order", { ascending: true })
      .order("order", { referencedTable: "skills", ascending: true })
      .eq("user_id", user_id);

    if (response.error) {
      throw response.error;
    }
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateSkillStation = async (
  station_id: number,
  duration: string | null,
  name: string,
  show_duration: boolean,
) => {
  try {
    const { data, error } = await client
      .from("skill_stations")
      .update({ duration: duration, name: name, show_duration: show_duration })
      .eq("id", station_id);

    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteSkillStation = async (station_id: number) => {
  try {
    const { data, error } = await client
      .from("skill_stations")
      .delete()
      .eq("id", station_id);

    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export const createSkillStation = async () => {
  const user_id = await getUserId();

  try {
    const { data, error } = await client
      .from("skill_stations")
      .insert([{ name: "", user_id: user_id, order: 0 }]);

    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export const createSkill = async (station_id: number) => {
  const user_id = await getUserId();
  try {
    const { data, error } = await client
      .from("skills")
      .insert([{ name: "", station_id: station_id, user_id: user_id }]);

    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteSkill = async (skill_id: number) => {
  try {
    const { data, error } = await client
      .from("skills")
      .delete()
      .eq("id", skill_id);

    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateSkill = async (
  skill_id: number,
  name: string,
  repetitions: number,
  description: string,
) => {
  try {
    const { data, error } = await client
      .from("skills")
      .update({
        name: name,
        repetitions: repetitions,
        description: description,
      })
      .eq("id", skill_id);

    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export const uploadDrillStationMedia = async (
  station_id: number,
  file: File,
) => {
  const user_id = await getUserId();

  try {
    await client.storage
      .from("user-media")
      .upload(`${user_id}/drills/${station_id}/${file.name}`, file);
  } catch (error) {
    throw error;
  }
};

// ------------------ Drill Stations ------------------
// ------------------ Drill Stations ------------------
// ------------------ Drill Stations ------------------
export const getDrillStationMedia = async () => {
  const user_id = await getUserId();

  try {
    const { data: folderList, error } = await client.storage
      .from("user-media")
      .list(`${user_id}/drills`);

    if (error) {
      throw error;
    }
    if (folderList) {
      const foldersWithFilesArray = await Promise.all(
        folderList.map(async (folder) => {
          const { data: fileList, error } = await client.storage
            .from("user-media")
            .list(`${user_id}/drills/${folder.name}`);

          if (error) {
            throw error;
          }

          const nameArray = fileList.map((file) => {
            return {
              name: file.name,
              type: file.metadata.mimetype.split("/")[0] as string,
            };
          });

          return { folderId: folder.name, mediaList: nameArray };
        }),
      );

      const foldersWithSignedUrls = await Promise.all(
        foldersWithFilesArray.map(async (folder) => {
          const signedUrls = await Promise.all(
            folder.mediaList.map(async (file) => {
              const { data: signedUrl, error } = await client.storage
                .from("user-media")
                .createSignedUrl(
                  `${user_id}/drills/${folder.folderId}/${file.name}`,
                  120,
                );
              if (error) {
                throw error;
              }
              return { url: signedUrl.signedUrl, type: file.type };
            }),
          );
          return { drill_id: Number(folder.folderId), signedUrls: signedUrls };
        }),
      );
      return foldersWithSignedUrls;
    } else {
      throw new Error("No media found");
    }
  } catch (error) {
    throw error;
  }
};

//------------------ Drill Stations ------------------
//------------------ Drill Stations ------------------
//------------------ Drill Stations ------------------
//------------------ Drill Stations ------------------

export const getDrillStations = async (): Promise<drillStationType[]> => {
  const user_id = await getUserId();
  try {
    const {
      data: drillStationsNoMedia,
      error,
    }: PostgrestSingleResponse<DrillStationNoUrls[]> = await client
      .from("drill_stations")
      .select(
        `
          id,
          user_id,
          name,
          duration,
          show_duration,
          description,
          comments,
          order,
          type,
          show_media,
          show_comments
            `,
      )
      .order("order", { ascending: true })
      .eq("user_id", user_id);

    if (error) {
      throw error;
    }

    const drillStationMedia = await getDrillStationMedia();
    const drillStations: drillStationType[] = drillStationsNoMedia.map(
      (station) => {
        const media = drillStationMedia.find(
          (media) => media.drill_id === station.id,
        );
        if (media) {
          return { ...station, mediaUrls: media.signedUrls };
        } else {
          return { ...station, mediaUrls: [] };
        }
      },
    );

    return drillStations;
  } catch (error) {
    throw error;
  }
};

export const updateDrillStation = async ({
  comments,
  despcription,
  duration,
  name,
  show_duration,
  station_id,
}: UpdateDrillStationArgs) => {
  try {
    const { data, error } = await client
      .from("drill_stations")
      .update({
        duration: duration,
        name: name,
        show_duration: show_duration,
        description: despcription,
        comments: comments,
      })
      .eq("id", station_id);

    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteDrillStation = async (station_id: number) => {
  try {
    const { data, error } = await client
      .from("drill_stations")
      .delete()
      .eq("id", station_id);

    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export const createDrillStation = async (order: number) => {
  const user_id = await getUserId();

  try {
    const { data, error } = await client
      .from("drill_stations")
      .insert([{ name: "", user_id: user_id, order: order }]);

    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export const getAllStations = async () => {
  const skillStations = await getSkillStations();
  const drillStations = await getDrillStations();

  const stations = [...skillStations, ...drillStations];

  stations.sort((a, b) => a.order - b.order);

  return stations;
};
