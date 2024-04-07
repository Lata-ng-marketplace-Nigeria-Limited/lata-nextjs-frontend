"use client";

import React from "react";
import Button from "../atom/Button";
import AppAvatar from "../molecule/Avatar";
import { useRouter } from "next/navigation";
import { VIEW_SELLERS_ROUTE } from "@/constants/routes";
import { User } from "@/interface/user";
import SendMessage from "../input/SendMessage";

interface Props {
  name: string;
  imgSrc: string | undefined;
  btnText: string;
  role: User["role"];
  userId: string;
  onBtnClick?: () => void;
}
const UserBanner = (props: Props) => {
  const { push } = useRouter();
  const [isMessage, setIsMessage] = React.useState(false);

  const handleBtnClick = () => {
    if (props.role === "SELLER") {
      push(`${VIEW_SELLERS_ROUTE}/${props.userId}/shop`);
      return;
    }

    if (
      props.role === "STAFF" &&
      props.btnText.toLowerCase().includes("message")
    ) {
      setIsMessage(true);
      return;
    } else {
      props.onBtnClick?.();
    }
  };

  return (
    <div className="mb-6 rounded-xl border border-grey2 pb-2">
      <div className="h-[7rem] w-full rounded-t-xl bg-purp3 xlg:h-[9rem]"></div>
      <div className="gap-2 px-3 sm:flex sm:gap-5">
        <div className="flex gap-x-4">
          <div className="max-h-[9.6rem] max-w-[9.6rem] -translate-y-4 rounded-full border-4 border-white p-2">
            <AppAvatar
              name={props.name}
              src={props.imgSrc || undefined}
              className="!h-[6.25rem] !w-[6.25rem] sl:!h-[7.7rem] sl:!w-[7.7rem]"
              initialsClass="!text-[1.5rem] font-bold"
            />
          </div>
          <h2 className="mb-3 pt-6 text-xl font-medium text-grey10 sm:hidden">
            {props.name}
          </h2>
        </div>

        <div className="">
          <h2 className="mb-3 text-xl font-medium text-grey10 max-sl:text-3xl max-sm:hidden">
            {props.name}
          </h2>
          {isMessage ? (
            <SendMessage isNotProductMessage receiverId={props.userId} />
          ) : (
            <Button
              format="primary"
              onClick={handleBtnClick}
              className="w-full"
            >
              {props.btnText}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserBanner;
