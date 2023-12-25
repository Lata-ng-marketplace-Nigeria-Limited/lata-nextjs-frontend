"use client";

import React from "react";
import { months } from "./ProductInsights";

interface Props {
  number: number | string;
  title: string;
  description: string;
}

const AnalyticsSideCard = ({ number, title, description }: Props) => {
  const [month, setMonth] = React.useState("");

  React.useEffect(() => {
    const currentMonth = new Date().getMonth();
    setMonth(months[currentMonth].extra as string);
  }, []);

  return (
    <div className="px-6 pb-[1.12rem] pt-[1.81rem] rounded-lg border-solid shadow-black/10 border-[1px] border-grey2">
      <p className="mb-4 text-grey6">{title}</p>
      <p className="mb-4 text-2xl">{number}</p>
      <p className="text-grey6 text-sm">{month}</p>
    </div>
  );
};

export default AnalyticsSideCard;
