import React from "react";
import { UserDetailContainer } from "./UserDetail";
import { ITarget } from "@/interface/target";
import { cn, formatNumber } from "@/utils";
import UnCheckedBoxPurple from "../atom/icons/UnCheckedBoxPurple";
import CheckedboxPurple from "../atom/icons/CheckedboxPurple";

interface Props {
  targets: ITarget[];
  sales: number;
  targetPay: ITarget;
  wrapperClass?: string;
}

const Targets = (props: Props) => {
  return (
    <UserDetailContainer
      wrapperClass={cn(props.wrapperClass)}
      heading="Targets"
      headingClass={cn("text-base sl:text-xl")}
    >
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-4 lg:grid-cols-5 lg:gap-1">
        {props?.targets?.map((target, index) => (
          <div
            className="mb-10 flex items-center gap-2 sm:mb-0 sl:gap-3"
            key={index}
          >
            {props.targetPay?.id === target?.id ? (
              <CheckedboxPurple className="h-[16px] w-[16px]" />
            ) : (
              <UnCheckedBoxPurple className="h-[16px] w-[16px]" />
            )}
            <p className="text-sm font-normal sl:text-lg">
              Target {target?.level}, {formatNumber(target?.amount, true)}
            </p>
          </div>
        ))}
      </div>
    </UserDetailContainer>
  );
};

export default Targets;
