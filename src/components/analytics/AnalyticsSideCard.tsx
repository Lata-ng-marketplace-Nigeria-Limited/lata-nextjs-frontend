import React from "react";

interface Props {
  clicksCount: number ;
  title: string;
  description: string;
}

const AnalyticsSideCard = ({ clicksCount, title, description }: Props) => {
  return (
    <div className="px-6 pb-[1.12rem] pt-[1.81rem] rounded-lg border-solid shadow-black/10 border-[1px] border-grey2">
      <p className="mb-4 text-grey6">{title}</p>
      <p className="mb-4 text-2xl">{clicksCount}</p>
      <p className="text-grey6 text-sm">{description}</p>
    </div>
  );
};

export default AnalyticsSideCard;
