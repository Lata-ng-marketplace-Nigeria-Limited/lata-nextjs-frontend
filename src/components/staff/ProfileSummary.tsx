"use client";

import React from "react";
import AppAvatar from "../molecule/Avatar";
import { cn } from "@/utils";

interface Props {
  imgSrc: string;
  name: string;
  className?: string;
}
const ProfileSummary = (props: Props) => {
  return (
    <div className={cn("flex items-center gap-3", props.className)}>
      <AppAvatar src={props.imgSrc} name={props.name} />
      <div>
        <h2 className="text-xs font-medium text-grey11">
          {props.name?.split(" ")?.[0] || "Loading..."}
        </h2>
        <p className="text-[0.625rem] font-normal text-grey7">Staff</p>
      </div>
    </div>
  );
};

export default ProfileSummary;
