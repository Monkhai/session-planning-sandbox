"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getUserId } from "~/services/supabaseFunctions";
import client from "~/utils/supabaseClient";

export function useAuth() {
  const router = useRouter();
  useEffect(() => {
    getUserId().catch(() => router.replace("/login"));

    client.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/login");
      } else {
        router.push("/home");
      }
    });

    const { data: authListener } = client.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          router.push("/login");
        }
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
}
