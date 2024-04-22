"use client";

import React from "react";
import Button from "../atom/Button";
import AppAvatar from "../molecule/Avatar";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LANDING_ROUTE, VIEW_SELLERS_ROUTE } from "@/constants/routes";
import { User } from "@/interface/user";
import SendMessage from "../input/SendMessage";
import { useRoleSwitchStore } from "@/store/states/localStore";
import { useUser } from "@/hooks/useUser";

interface Props {
  name: string;
  imgSrc: string | undefined;
  btnText?: string;
  role: User["role"];
  userId: string;
  user: User;
  onBtnClick?: () => void;
}
const UserBanner = (props: Props) => {
  const { push, replace } = useRouter();
  const [isMessage, setIsMessage] = React.useState(false);
  const { user } = useUser();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { setIsSwitchingRole, setSessionUser, setSearchQuery, setPreviousUrl } =
    useRoleSwitchStore();

  const handleSwitchRole = () => {
    if (!(user?.role === "ADMIN" || user?.role === "STAFF") ) return;

    const params = new URLSearchParams(searchParams);

    params.set("sessionSwitched", "true");
    params.set("role", props.role.toLowerCase());
    params.set("uid", props.userId);
    setIsSwitchingRole("true");
    setSessionUser(props.user);
    setSearchQuery(params.toString());
    setPreviousUrl(pathname);

    replace(`${pathname}?${params.toString()}`);
    push(`${LANDING_ROUTE}?${params.toString()}`);
  };

  const handleBtnClick = () => {
    setIsMessage(true);
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

        <div className=" w-full">
          <h2 className="mb-3 text-xl font-medium text-grey10 max-sl:text-3xl max-sm:hidden">
            {props.name}
          </h2>
          <div className="flex items-center gap-4 max-sm:flex-wrap">
            {isMessage ? (
              <SendMessage isNotProductMessage receiverId={props.userId} />
            ) : (
              <Button
                format="primary"
                onClick={handleBtnClick}
                className="w-full sm:max-w-max"
              >
                {props.btnText || "Send Message"}
              </Button>
            )}
            <Button
              format="secondary"
              className="w-full sm:max-w-max"
              onClick={handleSwitchRole}
            >
              Go to profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBanner;
