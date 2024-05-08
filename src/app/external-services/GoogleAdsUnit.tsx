"use client";

import { usePathname, useSearchParams } from "next/navigation";
import React from "react";

interface Props extends React.InsHTMLAttributes<HTMLElement> {}

const GoogleAdsUnit = ({ ...props }: Props) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // React.useEffect(() => {
  //   const loadAds = () => {
  //     let adsbygoogle = (window as any).adsbygoogle;
  //     try {
  //       if (adsbygoogle && !adsbygoogle?.loaded) return;
      
  //       const adsElements = document.getElementsByClassName("adsbygoogle");
  //       console.log("adsElements", adsElements);
  //       if (adsbygoogle) {
  //         (adsbygoogle = adsbygoogle || []).push({});

  //         console.log("ads length", adsbygoogle?.length);

  //         // window.addEventListener("load", function () {
  //         //   ((window as any).adsbygoogle =
  //         //     (window as any).adsbygoogle || []).push({});
  //         // });

  //         console.log("Ads with content", (window as any).adsbygoogle);
  //       }
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };
  //   // console.log("Ads", Array.isArray((window as any).adsbygoogle) );
  //   // console.log("Ads", (window as any).adsbygoogle) ;
  //   loadAds();
  // }, [pathname, searchParams]);

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
