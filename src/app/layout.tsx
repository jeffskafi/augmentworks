import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
// Removed unused icon imports to reduce bundle size
import { Suspense } from "react";
import PostHogProvider from "~/components/PostHogProvider";
import PostHogPageView from "~/components/PostHogPageView";

export const metadata: Metadata = {
  title: "AugmentWorks · Ship AI Agents, Sleep at Night",
  description:
    "AugmentWorks is the safety infrastructure layer for GenAI. Runtime defense, monitoring, and eval suites that let enterprises deploy AI agents with confidence.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: {
    title: "AugmentWorks · Ship AI Agents, Sleep at Night",
    description:
      "The product brief for AugmentWorks—firewall, QA harness, and audit trail for enterprise AI deployments.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AugmentWorks · Ship AI Agents, Sleep at Night",
    description:
      "Defense, monitoring, and evaluation for high-stakes GenAI agents. Deploy with confidence.",
  },
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "AugmentWorks Governance",
              url: "https://augmentworks.com",
              sameAs: [
                "https://www.linkedin.com/company/augmentworks",
                "https://x.com/augmentworks",
              ],
              description:
                "Safety infrastructure for GenAI. AugmentWorks delivers runtime defense, monitoring, and evaluation suites so enterprises can deploy AI agents with confidence.",
              contactPoint: [
                {
                  "@type": "ContactPoint",
                  email: "sales@augmentworks.com",
                  contactType: "sales",
                },
              ],
            }),
          }}
        />
      </head>
      <body className="flex flex-col min-h-screen overflow-x-hidden">
        <PostHogProvider>
          <Suspense fallback={null}>
            <PostHogPageView />
          </Suspense>
          {children}
        </PostHogProvider>
      </body>
    </html>
  );
}
