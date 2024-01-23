import client from "~/utils/supabaseClient";

export default async (ids: number[]) => {
  try {
    const { error } = await client.from("drills").delete().in("id", ids);

    if (error) throw error;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
