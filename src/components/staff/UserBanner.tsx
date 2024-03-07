"use client";

import Image, { StaticImageData } from "next/image";
import React from "react";
import Button from "../atom/Button";
import AppAvatar from "../molecule/Avatar";
import { useRouter } from "next/navigation";
import {
  ADMIN_ALL_SELLERS_ROUTE,
  DASHBOARD_MY_SHOP_ROUTE,
} from "@/constants/routes";
import { User } from "@/interface/user";

interface Props {
  name: string;
  imgSrc: string | undefined;
  btnText: string;
  role: User["role"];
  userId?: string;
  onBtnClick?: () => void;
}
const UserBanner = (props: Props) => {
  const { push } = useRouter();

  const handleBtnClick = () => {
    if (props.role === "SELLER") {
      push(`${ADMIN_ALL_SELLERS_ROUTE}/${props.userId}/shop`);
    }

    if(props.onBtnClick) {
      props.onBtnClick();
    }
  };

  return (
    <div className="mb-6 rounded-xl border border-grey2 p-4 xlg:p-6">
      <div className="h-[7rem] w-full rounded-t-xl bg-purp3 xlg:h-[9rem]"></div>
      <div className="gap-2 px-3 xs:flex-row xlg:flex xlg:gap-5 xlg:px-14">
        <div className="flex gap-x-4 ">
          <div className="max-h-[9.6rem] max-w-[9.6rem] -translate-y-10 rounded-full border-4 border-white p-2">
            <AppAvatar
              name={props.name}
              src={props.imgSrc || undefined}
              className="!h-[6.25rem] !w-[6.25rem]"
              initialsClass="!text-[1.5rem] font-bold"
            />
          </div>
          <h2 className="mb-3 text-xl font-medium text-grey10 xlg:hidden">
            {props.name}
          </h2>
        </div>

        <div>
          <h2 className="mb-3 text-xl font-medium text-grey10 max-xlg:hidden sl:text-3xl ">
            {props.name}
          </h2>
          <Button format="primary" onClick={handleBtnClick}>
            {props.btnText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserBanner;
