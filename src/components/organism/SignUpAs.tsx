"use client";

import Image from "next/image";
import Button from "@atom/Button";
import { useFastLocalStore } from "@/store/states/localStore";
import { useRouter } from "next/navigation";
import { BUYER_SIGN_UP_ROUTE, SELLER_SIGN_UP_ROUTE } from "@/constants/routes";
import { useEffect } from "react";

export const SignUpAs = () => {
  const { setSelectedRole } = useFastLocalStore();
  const navigate = useRouter();

  useEffect(() => {
    navigate.prefetch("/auth" + BUYER_SIGN_UP_ROUTE);
    navigate.prefetch("/auth" + SELLER_SIGN_UP_ROUTE);
  }, [navigate]);

  return (
    <section className="w-full px-[24px] sm:px-[30px] md:px-[40px] lg:px-[80px] flex flex-col justify-center items-center min-h-screen overflow-auto">
      <div className={"flex justify-center items-center mb-[163px]"}>
        <Image
          src="https://res.cloudinary.com/dg9by7oca/image/upload/v1688237987/image14lat-removebg-preview_2_zbduqw.svg"
          alt="logo"
          width={200}
          height={74.571}
          className={"w-[150px] h-[55.929px] sm:w-[200px] sm:h-[74.571px]"}
        />
      </div>

      <div className={"flex flex-col gap-y-6 items-center w-full"}>
        <Button
          format={"primary"}
          className={"w-full"}
          onClick={() => {
            setSelectedRole("BUYER");
            navigate.push("/auth" + BUYER_SIGN_UP_ROUTE);
          }}
        >
          I want to buy
        </Button>
        <Button
          format={"secondary"}
          className={"w-full"}
          onClick={() => {
            setSelectedRole("SELLER");
            navigate.push("/auth" + SELLER_SIGN_UP_ROUTE);
          }}
        >
          I want to sell
        </Button>
      </div>
    </section>
  );
};
