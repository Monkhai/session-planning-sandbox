"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import client from "~/utils/supabaseClient";

export function useAuth() {
  const router = useRouter();
  useEffect(() => {
    client.auth.getSession().then((response) => {
      if (!response || !response.data.session || response.error) {
        router.replace("/login");
      } else {
        router.replace("/home");
      }
    });

    const { data: authListener } = client.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          router.replace("/login");
        } else {
          router.replace("/home");
        }
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
}
