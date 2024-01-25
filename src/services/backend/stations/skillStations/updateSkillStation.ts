import client from "~/utils/supabaseClient";

export default async (
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
      console.error(error);
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
};
