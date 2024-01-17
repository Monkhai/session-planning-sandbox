import { RefObject, useEffect } from "react";
import { getUserId } from "~/services/supabaseFunctions";
import client from "~/utils/supabaseClient";

export const useUserSeenOnboard = (dialogRef: RefObject<HTMLDialogElement>) => {
  useEffect(() => {
    const userSeenOnboard = async () => {
      const userId = getUserId();
      if (!userId) {
        console.error("User not found");
        return;
      }
      const { data, error } = await client
        .from("user_data")
        .select("seen_onboard")
        .eq("user_id", userId);

      if (error) {
        console.error(error);
        return;
      }

      if (data) {
        const seenOnboard = data[0]?.seen_onboard ?? false;
        if (!seenOnboard) {
          dialogRef.current?.showModal();
        }
      }
    };

    userSeenOnboard();
  }, []);
};
