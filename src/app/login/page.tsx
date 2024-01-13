"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { IoIosMail } from "react-icons/io";
import NavBar from "~/components/NavBar";
import introductionText from "~/utils/introductionText";
import client from "~/utils/supabaseClient";
import * as IGLogo from "../../../public/instagram.png";

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
    <section className="flex h-screen flex-col items-center justify-start ">
      <NavBar />

      <section className="flex h-full w-full flex-col items-center justify-center gap-4 pt-4">
        <div className="flex w-1/4">
          <p className="text-center text-xl font-semibold">
            {introductionText}
          </p>
        </div>
        <div className="flex flex-col items-center gap-4">
          <p className="text-center text-xl font-semibold">
            If you have any questions, Please contact me!
          </p>
          <div className="flex w-1/2 flex-row items-center justify-between">
            <a type="email" href="mailto:yohaiwiener@gmail.com">
              <IoIosMail size={70} color={"black"} />
            </a>
            <a
              href="https://www.instagram.com/yohai_wiener"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image alt="Instagram logo" src={IGLogo} width={50} height={50} />
            </a>
          </div>
        </div>
        {/* <Spacer /> */}
        {/* <div className="w-1/4">
          <Auth
            onlyThirdPartyProviders
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
        </div> */}
        {/* <Spacer /> */}
      </section>
    </section>
  );
};

export default Login;
