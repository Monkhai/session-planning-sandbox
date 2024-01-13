"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getUserId } from "~/services/supabaseFunctions";
import client from "~/utils/supabaseClient";

export function useAuth(redirectIfNotAuth = true) {
  const router = useRouter();

  useEffect(() => {
    getUserId().catch(() => router.replace("/login"));
    // Check if the user is signed in
    client.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/login"); // Redirect to login if no session
      } else {
        if (redirectIfNotAuth) {
          router.push("/home"); // Redirect to home if authenticated
        }
      }
    });

    // Listen to session changes
    const { data: authListener } = client.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          router.push("/login");
        }
      },
    );

    // Cleanup listener on component unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);
}
