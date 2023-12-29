import React from "react";

interface Props {
  clicksCount: number;
  title: string;
  description: string;
}

const AnalyticsSideCard = ({ clicksCount, title, description }: Props) => {
  return (
    <div className="px-2 tablet:px-6 py-2 tablet:py-3 rounded-lg border-solid shadow-black/10 border-[1px] border-grey2">
      <p className="text-grey6 tablet:mb-3 mb-2 font-medium text-xs tablet:text-base">
        {title}
      </p>
      <p className="tablet:mb-3 font-semibold mb-2 tablet:text-xl text-lg">{clicksCount}</p>
      <p className="text-grey6 text-xs tablet:text-base">{description}</p>
    </div>
  );
};

export default AnalyticsSideCard;
