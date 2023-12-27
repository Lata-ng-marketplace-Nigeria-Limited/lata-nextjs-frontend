import React from "react";

interface Props {
  clicksCount: number;
  title: string;
  description: string;
}

const AnalyticsSideCard = ({ clicksCount, title, description }: Props) => {
  return (
    <div className="px-2 tablet:px-6 pb-[0.84rem] tablet:pb-[1.12rem] pt-[1.5rem] tablet:pt-[1.81rem] rounded-lg border-solid shadow-black/10 border-[1px] border-grey2">
      <p className="text-grey6 tablet:mb-4 mb-2 text-xs tablet:text-base">
        {title}
      </p>
      <p className="tablet:mb-4 mb-2 tablet:text-2xl text-lg">{clicksCount}</p>
      <p className="text-grey6 text-xs tablet:text-base">{description}</p>
    </div>
  );
};

export default AnalyticsSideCard;
