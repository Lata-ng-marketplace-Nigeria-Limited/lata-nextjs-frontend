import { GetUser } from "@atom/GetUser";
import { Metadata } from "next";
import GoogleAdsUnit from "@/app/external-services/GoogleAdsUnit";

export const metadata: Metadata = {
  title: "About Us",
};

export default async function Page() {
  return (
    <div>
      <GetUser />

      <h1
        className={
          " text-base tablet:text-[40px] lg:text-[50px] font-semibold mb-7"
        }
      >
        Welcome to Lata
      </h1>

      {/* <HeroImage
        src={
          "https://res.cloudinary.com/dg9by7oca/image/upload/v1691381515/About_latae_458_qqdcht.webp"
        }
        alt={`Hero`}
      /> */}
      <GoogleAdsUnit />

      <article className={"mt-[60px] flex flex-col gap-y-6"}>
        <h2
          className={"text-sm tablet:text-[22px] lg:text-[32px] font-semibold"}
        >
          About Lata
        </h2>

        <p
          className={
            " text-xs tablet:text-[16px] leading-6 lg:text-[20px] font-medium"
          }
        >
          LATA.ng is Nigeria classified marketplace where buyers and sellers
          meet effortlessly. The company’s mission is to provide a platform
          where individuals and businesses can buy and sell products in a
          safe,secure, fast, better and convenient manner. You can sell anything
          and buy everything with ease. We assure you fast selling experience,
          buying anything at all time is possible with us.
        </p>
      </article>
    </div>
  );
}
