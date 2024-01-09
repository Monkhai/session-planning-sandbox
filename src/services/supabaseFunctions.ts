import { PostgrestSingleResponse } from "@supabase/supabase-js";
import client from "~/utils/supabaseClient";
import { Station } from "~/utils/types";

export const getUserId = async () => {
  const { data } = await client.auth.getUser();
  const user_id = data.user?.id;
  if (!user_id) {
    throw new Error("No user id found");
  }
  return user_id;
};

export const getStations = async (): Promise<Station[]> => {
  const user_id = await getUserId();
  try {
    const response: PostgrestSingleResponse<Station[]> = await client
      .from("stations")
      .select(
        `
                id,
                name,
                duration,
                order,
                user_id,
                skills (
                  station_id,
                    id,
                    name,
                    repetitions,
                    order,
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

export const getOneStation = async (station_id: number): Promise<Station> => {
  try {
    const response: PostgrestSingleResponse<Station[]> = await client
      .from("stations")
      .select(
        `
                id,
                name,
                duration,
                order,
                user_id,
                skills (
                  station_id,
                    id,
                    name,
                    repetitions,
                    order,
                    user_id
                )
            `,
      )
      .eq("id", station_id);

    if (response.error) {
      throw response.error;
    }
    if (response.data[0]) {
      return response.data[0];
    } else {
      throw new Error("No station found");
    }
  } catch (error) {
    throw error;
  }
};

//-----------------------------------------------------
//-----------------------------------------------------

export const updateStationName = async (
  station_id: number,
  stationName: string,
) => {
  try {
    const { data, error } = await client
      .from("stations")
      .update({ name: stationName })
      .eq("id", station_id);

    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export const updateStationDuration = async (
  station_id: number,
  duration: string | null,
) => {
  try {
    const { data, error } = await client
      .from("stations")
      .update({ duration: duration })
      .eq("id", station_id);

    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteStation = async (station_id: number) => {
  try {
    const { data, error } = await client
      .from("stations")
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

export const createStation = async () => {
  const user_id = await getUserId();

  try {
    const { data, error } = await client
      .from("stations")
      .insert([{ name: "", user_id: user_id }]);

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
) => {
  try {
    const { data, error } = await client
      .from("skills")
      .update({ name: name, repetitions: repetitions })
      .eq("id", skill_id);

    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
};
