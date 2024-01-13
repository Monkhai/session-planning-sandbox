/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        // pathname: "/storage/v1/object/user-media/**",
        hostname: "srilvebciftclqzzfycz.supabase.co",
      },
    ],
  },
};

export default config;
