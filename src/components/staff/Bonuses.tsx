import React from "react";
import { UserDetailContainer } from "./UserDetail";
import { cn } from "@/utils";

interface Props {
  wrapperClass?: string;
}
const Bonuses = (props: Props) => {
  const bonuses = [
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
        {bonuses.map((bonus, index) => (
          <p className="text-sm font-normal mb-10 sm:mb-0 sl:text-lg" key={index}>
            {bonus.interval} {bonus.period} bonus = {bonus.amount}
          </p>
        ))}
      </div>
    </UserDetailContainer>
  );
};

export default Bonuses;
