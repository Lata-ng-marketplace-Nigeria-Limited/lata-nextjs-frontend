"use client";

import Image, { StaticImageData } from "next/image";
import React from "react";
import Button from "../atom/Button";
import AppAvatar from "../molecule/Avatar";

interface Props {
  name: string;
  imgSrc: string | undefined;
  btnText: string;
  onBtnClick?: () => void;
}
const UserBanner = (props: Props) => {
  return (
    <div className="mb-6 rounded-xl border border-grey2 p-4 sl:p-6">
      <div className="h-[7rem] w-full rounded-t-xl bg-purp3 sl:h-[9rem]"></div>
      <div className="px-7 xs:flex-row sl:flex sl:gap-5 sl:px-14">
        <div className="flex gap-x-4">
          <div className="max-h-[9.6rem] max-w-[9.6rem] -translate-y-10 rounded-full border-4 border-white p-2">
            {/* <Image
              src={props.imgSrc || ""}
              alt="user-banner"
              width={123}
              height={123}
              className="rounded-full"
            /> */}
            <AppAvatar
              name={props.name}
              src={props.imgSrc || undefined}
              className="!h-[6.25rem] !w-[6.25rem] text-base"
            />
          </div>
          <h2 className="mb-3 text-xl font-medium text-grey10 sl:hidden ">
            {props.name}
          </h2>
        </div>

        <div>
          <h2 className="mb-3 text-3xl font-medium text-grey10 max-sl:hidden">
            {props.name}
          </h2>
          <Button format="primary" onClick={props.onBtnClick}>
            {props.btnText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserBanner;
