"use client";

import HeroImage from "@/components/molecule/HeroImage";
import { usePathname, useSearchParams } from "next/navigation";
import React from "react";

interface Props extends React.InsHTMLAttributes<HTMLElement> {}

const GoogleAdsUnit = ({ ...props }: Props) => {
  const [loaded, setLoaded] = React.useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    setLoaded(false);
    const loadAds = () => {
      try {
        if ((window as any).adsbygoogle) {
          ((window as any).adsbygoogle =
            (window as any).adsbygoogle || []).push({});
          setLoaded(true);
        } else {
          setLoaded(false);
        }
      } catch (err) {
        console.log(err);
      }
    };
    loadAds();
  }, [pathname, searchParams]);

  return (
    <>
      {loaded ? (
        <div className="mx-auto w-full text-center">
          <ins
            className="adsbygoogle adbanner-customize"
            style={{ display: "block", width: "100%" }}
            data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}
            data-ad-slot="2711689551"
            data-ad-format="auto"
            data-full-width-responsive="true"
            {...props}
          ></ins>
        </div>
      ) : (
        <HeroImage
          src={
            "https://res.cloudinary.com/dg9by7oca/image/upload/v1691381515/About_latae_458_qqdcht.webp"
          }
          alt={`Hero`}
        />
      )}
    </>
  );
};

export default GoogleAdsUnit;
