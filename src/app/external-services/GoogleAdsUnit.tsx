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
        const adsElements = document.getElementsByClassName("adsbygoogle");
        for (let i = 0; i < adsElements.length; i++) {
          const adsElement = adsElements[i] as HTMLElement;
          if (adsElement.childNodes.length === 0) {
            // If the 'ins' element is empty, push the ad
            if ((window as any).adsbygoogle) {
              ((window as any).adsbygoogle =
                (window as any).adsbygoogle || []).push({});
            }
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    loadAds();
  }, [pathname, searchParams]);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block" }}
      data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}
      data-ad-slot="4039248860"
      data-ad-format="auto"
      data-full-width-responsive="true"
      {...props}
    ></ins>
  );
};

export default GoogleAdsUnit;
