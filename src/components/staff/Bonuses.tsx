import React from "react";
import { UserDetailContainer } from "./UserDetail";

const Bonuses = () => {
  const bonuses = [
    { interval: "Week", period: 1, amount: 1000 },
    { interval: "Week", period: 2, amount: 1000 },
    { interval: "Week", period: 3, amount: 1000 },
    { interval: "Year", period: 4, amount: 1000 },
  ];
  return (
    <UserDetailContainer heading="Bonuses">
      <div className="grid grid-cols-2 items-center gap-2 sm:grid-cols-4">
        {bonuses.map((bonus, index) => (
          <p className="text-lg font-normal" key={index}>
            {bonus.interval} {bonus.period} bonus = {bonus.amount}
          </p>
        ))}
      </div>
    </UserDetailContainer>
  );
};

export default Bonuses;
