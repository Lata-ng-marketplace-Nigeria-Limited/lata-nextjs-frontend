"use client";

import { usePathname, useSearchParams } from "next/navigation";
import React from "react";

interface Props extends React.InsHTMLAttributes<HTMLElement> {}

const GoogleAdsUnit = ({ ...props }: Props) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    const loadAds = () => {
      try {
        if ((window as any).adsbygoogle) {
          ((window as any).adsbygoogle =
            (window as any).adsbygoogle || []).push({});
        }
      } catch (err) {
        console.log(err);
      }
    };
    loadAds();
  }, [pathname, searchParams]);

  return (
    <ins
      className="adsbygoogle adbanner-customize"
      style={{ display: "block", width: "100%" }}
      data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}
      data-ad-slot="2711689551"
      data-ad-format="auto"
      data-full-width-responsive="true"
      {...props}
    ></ins>
  );
};

export default GoogleAdsUnit;
