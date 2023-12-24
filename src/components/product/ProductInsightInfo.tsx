import React from "react";
import Hr from "@atom/Hr";

interface Props {
  icon: React.ReactNode;
  title: string;
  count: number;
}

export default function ProductInsightInfo(props: Props) {
  return (
    <div className={"flex flex-col gap-y-3 md:gap-y-6"}>
      <div className={"flex justify-between items-center"}>
        <div className={"flex gap-x-2 items-center"}>
          <div>{props.icon}</div>
          <p className={"text-sm md:text-base font-medium text-grey7"}>
            {props.title}
          </p>
        </div>

        <p className={"text-sm md:text-base font-semibold text-grey8"}>
          {props.count}
        </p>
      </div>

      <Hr className={"border-grey2"} />
    </div>
  );
}
