"use client";

import HeroImage from "@/components/molecule/HeroImage";
import { cn } from "@/utils";
import React from "react";

interface Props extends React.InsHTMLAttributes<HTMLElement> {}

const GoogleAdSense = ({ ...props }: Props) => {
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    setLoaded(false);
    try {
      if ((window as any).adsbygoogle) {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push(
          {}
        );
        setLoaded(true);
      }else{
        setLoaded(false);
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  return (
    <>
      {loaded ? (
        <div className="w-full mx-auto text-center">
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

export default GoogleAdSense;
