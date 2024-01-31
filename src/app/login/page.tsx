"use client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { IoIosMail } from "react-icons/io";
import NavBar from "~/components/NavBar";
import introductionText from "~/utils/introductionText";
import client from "~/utils/supabaseClient";
import * as IGLogo from "../../../public/instagram.png";
import * as DarkIGLogo from "../../../public/instagram-dark.png";
import Spacer from "~/components/utility/Spacer";

const Login = () => {
  const router = useRouter();

  useEffect(() => {
    client.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.push("/home");
      }
    });
  }, []);

  return (
    <section className="flex h-[100dvh] flex-col items-center justify-start dark:bg-darkBackground">
      <NavBar />

      <section className="flex h-full w-full flex-col items-center justify-center gap-4 pt-4">
        <Spacer />
        <div className="flex w-[90%]  justify-center ">
          <h1 className="text-center font-semibold">
            Login to the Session Planner
          </h1>
        </div>
        <Spacer />
        <div className="md:w-1/4">
          <Auth
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: "var(--color-blue)",
                    brandAccent: "var(--color-blue)",
                  },
                },
              },
            }}
            supabaseClient={client}
            providers={["google"]}
            redirectTo="/home"
          />
        </div>
        <Spacer />
        <Spacer />
      </section>
    </section>
  );
};

export default Login;
