"use client";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getUserId } from "~/services/supabaseFunctions";
import client from "~/utils/supabaseClient";

export function useAuth(router: AppRouterInstance) {
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
