import client from "~/utils/supabaseClient";
import {
  SkillStationType,
  StationFromDB,
  StationOfSessionFromDB,
  StationType,
} from "~/utils/types";
import getUserId from "../../userManagement/getUserId";
import { PostgrestSingleResponse } from "@supabase/supabase-js";

export default async (lastOrder: number, session_id: string) => {
  const user_id = getUserId();
  if (!user_id) {
    throw new Error("No user id found");
  }

  try {
    const { data, error }: PostgrestSingleResponse<StationFromDB[]> =
      await client
        .from("stations")
        .insert([
          {
            name: "",
            user_id: user_id,
            type: "skillStation" as StationType,
          },
        ])
        .select();

    if (error) {
      throw error;
    }
    if (!data) {
      throw new Error("No data returned from database");
    }

    if (!data[0]) throw new Error("No data returned from database");

    const { error: error2 }: PostgrestSingleResponse<StationOfSessionFromDB[]> =
      await client
        .from("stations_of_sessions")
        .insert([
          {
            user_id: user_id,
            station_id: data[0].id,
            session_id: Number(session_id),
            order: lastOrder + 1,
          },
        ])
        .select();

    if (error2) {
      throw error2;
    }

    if (!data) throw new Error("No data returned from database");
    if (!data[0]) throw new Error("No data returned from database");

    const station: SkillStationType = {
      ...data[0],
      order: lastOrder + 1,
    };

    return station;
  } catch (error) {
    throw error;
  }
};
