import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/utils";
import { NextAuthProvider } from "@/components/SessionProvider";
import { getServerSession } from "next-auth";
import { Toaster } from "@/components/ui/toaster";
import { authConfig } from "@authConfig";
import { Viewport } from "next";
import Script from "next/script";
import {
  organizationStructuredData,
  websiteStructuredData,
} from "@/store/seo/structuredData";
import { SpeedInsights } from "@vercel/speed-insights/next";
import GoogleAnalytics from "../analytics/GoogleAnalytics";
import { IEnv } from "@/interface/general";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#5113A1",
};

export const metadata: Metadata = {
  title: {
    template: "%s | Lata.ng",
    default: "Lata.ng",
  },
  description:
    "GET 100% VALUE WITH GUARANTY. Buy, sell, or rent vehicles of all types, Real estate,  motorcycles, trucks, electronics, gadgets, home and office accessories, constructions, medicals, agric and food, fashion, buses and search for your dream job on Lata.ng.  Explore a diverse range of products and connect with a vibrant community of sellers and buyers.",
  metadataBase: new URL("https://res.cloudinary.com"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
      "de-DE": "/de-DE",
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  bookmarks: ["https://lata.ng"],
  category: "sales",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authConfig);
  return (
    <html lang="en">
      <head key="google-adsense">
        <meta
          name="google-adsense-account"
          content={process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}
        />
      </head>
      <GoogleAnalytics
        GA_TRACKING_ID={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS as IEnv}
      />
      {/* <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}`}
        crossOrigin="anonymous"
        strategy="lazyOnload"
      /> */}

      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationStructuredData),
        }}
        id={"organisation-structured-data"}
      />
      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteStructuredData),
        }}
        id={"website-structured-data"}
      />

      <body className={cn(inter.className, "h-full antialiased")}>
        <NextAuthProvider session={session as any}>{children}</NextAuthProvider>
        <Toaster />
        <SpeedInsights />
      </body>
      <Script src={"https://js.paystack.co/v2/inline.js"}></Script>
      <Script
        type="module"
        src="https://cdn.jsdelivr.net/npm/emoji-picker-element@^1/index.js"
      ></Script>
    </html>
  );
}
