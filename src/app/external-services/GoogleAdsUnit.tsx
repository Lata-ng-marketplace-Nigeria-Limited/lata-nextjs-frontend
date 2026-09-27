"use client";

import React from "react";

interface Props extends React.InsHTMLAttributes<HTMLElement> { }

const GoogleAdsUnit = ({ ...props }: Props) => {
  const adRef = React.useRef<HTMLModElement>(null);
  const initialized = React.useRef(false);

  React.useEffect(() => {
    if (initialized.current) return;

    const pushAd = () => {
      if (initialized.current) return;
      if (
        typeof window !== "undefined" &&
        adRef.current &&
        adRef.current.offsetWidth > 0 &&
        !adRef.current.getAttribute("data-adsbygoogle-status")
      ) {
        try {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push(
            {}
          );
          initialized.current = true;
        } catch (err) {
          console.error("Google Ads error:", err);
        }
      }
    };

    pushAd();

    if (!initialized.current) {
      const rafId = requestAnimationFrame(() => {
        pushAd();
      });
      return () => cancelAnimationFrame(rafId);
    }
  }, []);

  return (
    <ins
      ref={adRef}
      className="adsbygoogle"
      style={{ display: "block", width: "100%", minHeight: "250px" }}
      data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}
      data-ad-slot="4039248860"
      data-ad-format="auto"
      data-full-width-responsive="true"
      data-adtest={process.env.NODE_ENV === "development" ? "on" : undefined}
      {...props}
    ></ins>
  );
};

export default GoogleAdsUnit;
