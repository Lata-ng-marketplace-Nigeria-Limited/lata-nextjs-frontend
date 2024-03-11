import React from "react";
import { UserDetailContainer } from "./UserDetail";
import { cn } from "@/utils";
import { BonusTransaction } from "@/interface/staff";

interface Props {
  wrapperClass?: string;
  bonuses: Array<[string, BonusTransaction | null]>;
}
const Bonuses = (props: Props) => {
  const mockBonuses = [
    { interval: "Week", period: 1, amount: 0 },
    { interval: "Week", period: 2, amount: 0 },
    { interval: "Week", period: 3, amount: 0 },
    { interval: "Week", period: 4, amount: 0 },
  ];

  return (
    <UserDetailContainer
      wrapperClass={cn(props.wrapperClass)}
      heading="Bonuses"
      headingClass={cn("text-base sl:text-xl")}
    >
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-4 lg:gap-1">
        {props.bonuses?.length > 0
          ? props.bonuses?.map((bonus, index) => (
              <p
                className="mb-10 text-sm font-normal sm:mb-0 sl:text-lg"
                key={index}
              >
                {bonus?.[0]} bonus ={" "}
                {bonus?.[1] === null ? 0 : bonus?.[1]?.amount}
              </p>
            ))
          : mockBonuses.map((bonus, index) => (
              <p
                className="mb-10 text-sm font-normal capitalize sm:mb-0 sl:text-lg"
                key={index}
              >
                {bonus.interval} {bonus.period} bonus = {bonus.amount}
              </p>
            ))}
      </div>
    </UserDetailContainer>
  );
};

export default Bonuses;
