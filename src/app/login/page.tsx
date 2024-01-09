"use client";

import { SocialAuth } from "@supabase/auth-ui-react";
import client from "~/utils/supabaseClient";

const Login = () => {
  return (
    <section className="flex h-screen items-center justify-center">
      <div className="w-1/4">
        <SocialAuth
          supabaseClient={client}
          providers={["google"]}
          redirectTo="/home"
        />
      </div>
    </section>
  );
};

export default Login;
