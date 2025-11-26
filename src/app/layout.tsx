import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
// Removed unused icon imports to reduce bundle size
import { Suspense } from "react";
import PostHogProvider from "~/components/PostHogProvider";
import PostHogPageView from "~/components/PostHogPageView";

export const metadata: Metadata = {
  title: "AugmentWorks Governance",
  description:
    "AI Governance & Compliance Assurance. Hybrid SaaS + advisory that closes the $500k income plan with ten enterprise deals.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: {
    title: "AugmentWorks Governance",
    description:
      "Risk assurance, AI safety audits, and governance retainers for leaders who only need ten serious clients.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AugmentWorks Governance",
    description:
      "Risk assurance, AI safety audits, and governance retainers for leaders who only need ten serious clients.",
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
                "Hybrid AI Governance partner delivering safety audits, compliance automation, and risk assurance retainers.",
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
