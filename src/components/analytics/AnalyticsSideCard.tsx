import React from "react";

interface Props {
  clicksCount: number | string;
  title: string;
  description: string;
}

const AnalyticsSideCard = ({ clicksCount, title, description }: Props) => {
  return (
    <div className="px-6 py-3 rounded-xl border-solid border border-grey2">
      <p className="text-grey6 mb-3 font-medium text-base">
        {title}
      </p>
      <p className="mb-3 font-semibold text-xl">{clicksCount}</p>
      <p className="text-grey6 font-normal text-sm tablet:text-base">{description}</p>
    </div>
  );
};

export default AnalyticsSideCard;
