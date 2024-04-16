import client from "~/utils/supabaseClient";
import getUserId from "./getUserId";

export default async () => {
  try {
    const user_id = getUserId();
    if (!user_id) throw new Error("User not found");
    // await client.auth.admin.deleteUser(user_id, false);
    // await client.functions.invoke("hello-world",{body: {name: 'Yohai'}});
    const { data, error } = await client.functions.invoke('hello-world', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        
      },
      body: { name: 'Functions' },
    });
  } catch (error) {
    console.error(error);
  }
};
