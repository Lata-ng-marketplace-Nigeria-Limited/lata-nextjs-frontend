"use client";

import { usePathname, useSearchParams } from "next/navigation";
import React from "react";

interface Props extends React.InsHTMLAttributes<HTMLElement> { }

const GoogleAdsUnit = ({ ...props }: Props) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const initialized = React.useRef(false);

  React.useEffect(() => {
    if (initialized.current) return;
    try {
      if (typeof window !== "undefined") {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push(
          {}
        );
        initialized.current = true;
      }
    } catch (err) {
      console.error("Google Ads error:", err);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block", width: "100%", height: "280px" }}
      data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}
      data-ad-slot="4039248860"
      data-ad-format="rectangle"
      data-full-width-responsive="true"
      data-adtest={process.env.NODE_ENV === "development" ? "on" : undefined}
      {...props}
    ></ins>
  );
};

export default GoogleAdsUnit;
