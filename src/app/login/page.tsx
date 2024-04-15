"use client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import NavBar from "~/components/NavBar";
import Spacer from "~/components/utility/Spacer";
import client from "~/utils/supabaseClient";

const Login = () => {
  const router = useRouter();

  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const darkTheme = window.matchMedia("(prefers-color-scheme: dark)");

    const listener = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? "dark" : "light");
    };

    darkTheme.addEventListener("change", listener);

    return () => {
      darkTheme.removeEventListener("change", listener);
    };
  }, []);

  useEffect(() => {
    client.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.push("/home");
      }
    });
  }, []);

  return (
    <section className="dark:bg-dark-background-gradient bg-background-gradient flex h-[100dvh] flex-col items-center justify-start">
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
            theme={theme}
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
            providers={["google", "apple"]}
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
