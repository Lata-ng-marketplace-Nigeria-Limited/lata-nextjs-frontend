"use client";

import { IEnv } from "@/interface/general";
import Script from "next/script";
import React from "react";

const GoogleAnalytics = ({ GA_TRACKING_ID }: { GA_TRACKING_ID: IEnv }) => {
  if (process.env.NODE_ENV === "development") return;

  return (
    <>
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      ></Script>
      <Script id="google-analytics">
        {`window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '${GA_TRACKING_ID}')`}
      </Script>
    </>
  );
};

export default GoogleAnalytics;
