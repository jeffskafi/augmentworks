/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  async rewrites() {
    const upstream = (process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com").replace(/\/$/, "");
    const proxyPath = (process.env.NEXT_PUBLIC_POSTHOG_PROXY_PATH || "/a").replace(/\/$/, "");
    return [
      {
        source: `${proxyPath}/:path*`,
        destination: `${upstream}/:path*`,
      },
    ];
  },
};

export default config;
