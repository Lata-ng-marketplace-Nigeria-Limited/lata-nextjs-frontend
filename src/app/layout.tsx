import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/utils";
import { NextAuthProvider } from "@/components/SessionProvider";
import { auth } from "@/auth";
import { Toaster } from "@/components/ui/toaster";
import { Viewport } from "next";
import Script from "next/script";
import {
  organizationStructuredData,
  websiteStructuredData,
} from "@/store/seo/structuredData";
import SpeedInsights from "@/components/DynamicSpeedInsights";
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
      follow: true,
      noimageindex: false,
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
  const session = await auth();
  return (
    <html lang="en">
      <GoogleAnalytics
        GA_TRACKING_ID={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS as IEnv}
      />
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />

      {/* Meta Pixel Code */}
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '2070958323334727');
          fbq('track', 'PageView');
        `}
      </Script>

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
        {/* Meta Pixel noscript fallback */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=2070958323334727&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
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
