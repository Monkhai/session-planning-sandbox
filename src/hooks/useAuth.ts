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
      }
    });

    const { data: authListener } = client.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          router.replace("/login");
        }
      },
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
}
