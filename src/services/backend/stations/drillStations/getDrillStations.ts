import { PostgrestSingleResponse } from "@supabase/supabase-js";
import client from "~/utils/supabaseClient";
import {
  DrillFromDBType,
  DrillList,
  DrillStationType,
  DrillStationWithDrillsType,
  DrillType,
} from "~/utils/types";
import getUserId from "../../userManagement/getUserId";

const getDrillStations = async (
  user_id: string,
): Promise<DrillStationType[]> => {
  const {
    data: stations,
    error: stationsError,
  }: PostgrestSingleResponse<DrillStationType[]> = await client
    .from("drill_stations")
    .select(
      `
          id,
          user_id,
          name,
          duration,
          show_duration,
          order,
          type
        `,
    )
    .order("order", { ascending: true })
    .eq("user_id", user_id);

  if (stationsError) {
    throw stationsError;
  }

  return stations;
};

//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------

const getDrillList = async (stations: DrillStationType[]) => {
  return Promise.all(
    stations.map(async (station) => {
      const {
        data: drills,
        error: drillsError,
      }: PostgrestSingleResponse<
        { id: number; drill_id: number; order: number }[]
      > = await client
        .from("drills_of_drill_stations")
        .select(`id, drill_id, order`)
        .eq("drill_station_id", station.id);

      if (drillsError) {
        throw drillsError;
      }

      return { station_id: station.id, drillList: drills };
    }),
  );
};

//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------

const getDrillidIds = async (
  station: DrillStationType,
  drillList: DrillList[],
) => {
  const drillIds: number[] =
    drillList
      .find((drill) => drill.station_id === station.id)
      ?.drillList.map((drill) => drill.drill_id) ?? [];

  return drillIds;
};

//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------

const getDrills = async (drillIds: number[]) => {
  const {
    data: drills,
    error: drillsError,
  }: PostgrestSingleResponse<DrillFromDBType[]> = await client
    .from("drills")
    .select(
      `
            id,
            name,
            duration,
            show_duration,
            description,
            comments,
            show_comments,
            show_media,
            show_edit_media
            `,
    )
    .in("id", drillIds);

  if (drillsError) {
    throw drillsError;
  }

  return drills;
};

//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------

const insertOrderToDrills = (
  drills: DrillFromDBType[],
  station: DrillStationType,
  drillList: DrillList[],
): DrillType[] => {
  return drills.map((drill) => {
    const order: number =
      drillList
        .find((drillList) => drillList.station_id === station.id)
        ?.drillList.find((drillList) => drillList.drill_id === drill.id)
        ?.order ?? 0;

    const drillOfDrillStationId: number | undefined = drillList
      .find((drillList) => drillList.station_id === station.id)
      ?.drillList.find((drillList) => drillList.drill_id === drill.id)?.id;

    if (!drillOfDrillStationId || drillOfDrillStationId === undefined) {
      throw new Error("Can't find drill of drill station id");
    }

    return {
      ...drill,
      order: order,
      station_id: station.id,
      drillOfStationId: drillOfDrillStationId,
      user_id: station.user_id,
    } as DrillType;
  });
};

//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------

export default async (): Promise<DrillStationWithDrillsType[]> => {
  const user_id = getUserId();
  if (!user_id) {
    console.error("User not found");
    return [];
  }

  try {
    const stations = await getDrillStations(user_id);

    if (stations.length < 1) {
      return [];
    }

    const drillList = await getDrillList(stations);

    const stationsWithDrills: DrillStationWithDrillsType[] = await Promise.all(
      stations.map(async (station) => {
        const drillIds: number[] = await getDrillidIds(station, drillList);

        if (!drillIds || drillIds.length < 1) {
          return {
            ...station,
            drills: [],
          };
        }

        const drills = await getDrills(drillIds);

        const drillsWithOrder: DrillType[] = insertOrderToDrills(
          drills,
          station,
          drillList,
        );

        const sortedDrills = drillsWithOrder.sort((a, b) => a.order - b.order);

        const stationWithDrills = {
          ...station,
          drills: sortedDrills,
        };
        return stationWithDrills as DrillStationWithDrillsType;
      }),
    );

    return stationsWithDrills as DrillStationWithDrillsType[];
  } catch (error) {
    console.error(error);
    return [];
  }
};
