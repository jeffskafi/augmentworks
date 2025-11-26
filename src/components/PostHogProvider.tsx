"use client";

import { PostHogProvider as PHProvider } from "@posthog/react";
import posthog from "posthog-js";
import { useEffect } from "react";

type Props = {
  children: React.ReactNode;
};

// Initialize PostHog on the client only
function useInitPosthog() {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key) return;

    const upstream = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";
    const proxyPath = (process.env.NEXT_PUBLIC_POSTHOG_PROXY_PATH ?? "/a").replace(/\/$/, "");
    const host = typeof window !== "undefined" ? proxyPath : upstream;

    if (!posthog.__loaded) {
      posthog.init(key, {
        api_host: host,
        capture_pageview: false,
        persistence: "memory",
      });
      // Capture initial pageview after init
      posthog.capture("$pageview");
    }
  }, []);
}

export default function PostHogProvider({ children }: Props) {
  useInitPosthog();

  return <PHProvider client={posthog}>{children}</PHProvider>;
}


