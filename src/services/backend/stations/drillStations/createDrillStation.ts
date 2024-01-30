import client from "~/utils/supabaseClient";
import { DrillStationType, StationType } from "~/utils/types";
import getUserId from "../../userManagement/getUserId";

export default async (lastOrder: number, session_id: string) => {
  const user_id = getUserId();
  if (!user_id) {
    console.error("User not found");
    return [];
  }

  try {
    const { data, error } = await client
      .from("stations")
      .insert([
        {
          name: "",
          user_id: user_id,
          order: lastOrder + 1,
          type: "drillStation" as StationType,
        },
      ])
      .select();

    if (error) {
      throw error;
    }

    const { data: stationOfSession, error: error2 } = await client
      .from("stations_of_sessions")
      .insert([
        {
          user_id: user_id,
          station_id: data[0].id,
          session_id: Number(session_id),
        },
      ]);

    if (error2) {
      throw error2;
    }

    return data as DrillStationType[];
  } catch (error) {
    console.error(error);
    return [];
  }
};
