import { PostgrestSingleResponse } from "@supabase/supabase-js";
import client from "~/utils/supabaseClient";
import { DrillFromDBType } from "~/utils/types";
import getUserId from "../userManagement/getUserId";

const createDrill = async (user_id: string) => {
  const { data: drill, error }: PostgrestSingleResponse<DrillFromDBType[]> =
    await client
      .from("drills")
      .insert([
        {
          name: "",
          user_id: user_id,
        },
      ])
      .select();

  if (error) {
    throw error;
  }

  if (!drill || drill.length < 1 || drill[0] === undefined) {
    throw new Error("No drill");
  }

  return drill[0];
};

//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------

const createDrillOfDrillStation = async (
  user_id: string,
  drill_id: number,
  lastOrder: number,
  station_id: number,
) => {
  const { data: drills, error } = await client
    .from("drills_of_drill_stations")
    .insert([
      {
        user_id: user_id,
        drill_id: drill_id,
        drill_station_id: station_id,
        order: lastOrder + 1,
      },
    ])
    .select();

  if (error) {
    throw error;
  }

  return drills;
};

//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------

export default async (station_id: number, lastOrder: number) => {
  const user_id = getUserId();
  if (!user_id) {
    console.error("User not found");
    return null;
  }

  try {
    const drill = await createDrill(user_id);

    const drillOfDrillStation = await createDrillOfDrillStation(
      user_id,
      drill.id,
      lastOrder,
      station_id,
    );

    if (!drillOfDrillStation || drillOfDrillStation.length < 1) {
      throw new Error("No drill of drill station");
    }

    const drillWithOrder = {
      ...drill,
      order: drillOfDrillStation[0].order,
      station_id: station_id,
    };

    return drillWithOrder as DrillFromDBType;
  } catch (error) {
    throw error;
  }
};
