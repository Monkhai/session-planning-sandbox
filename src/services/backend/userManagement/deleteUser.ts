import client from "~/utils/supabaseClient";
import getUserId from "./getUserId";

export default async () => {
  try {
    const user_id = getUserId();
    if (!user_id) throw new Error("User not found");
    await client.auth.admin.deleteUser(user_id, false);
  } catch (error) {
    console.error(error);
  }
};
