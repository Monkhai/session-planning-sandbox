import client from "~/utils/supabaseClient";
import getListOfAthletes from "../athletes/getListOfGroupAthletes";
import deleteSessionsOfGroup from "../sessions/deleteSessionsOfGroup";
import deleteSessionsOfMultipleAthletes from "../sessions/deleteSessionsOfMultipleAthletes";
import getUserId from "../userManagement/getUserId";
import deleteMultipleAthletes from "../athletes/deleteMultipleAthletes";

export default async (group_id: number) => {
  try {
    const user_id = getUserId();

    if (!user_id) throw new Error("User not found");

    const athletes = await getListOfAthletes(group_id);

    const athlete_ids = athletes.map((athlete) => athlete.id);

    await deleteSessionsOfMultipleAthletes({ athlete_ids });
    await deleteSessionsOfGroup(group_id);
    await deleteMultipleAthletes(athlete_ids);

    const { error: deleteGroupError } = await client
      .from("groups")
      .delete()
      .eq("id", group_id)
      .eq("user_id", user_id);

    if (deleteGroupError) throw deleteGroupError;

    return;
  } catch (error) {
    throw error;
  }
};
