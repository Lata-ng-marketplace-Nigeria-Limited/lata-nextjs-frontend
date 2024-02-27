import React from "react";

interface Props {
  children: React.ReactNode;
}
const AnalyticsSideCardsHOC = (props: Props) => {
  return (
    <div className="mt-4 grid w-full grid-cols-1 gap-6 rounded border p-6 xs:grid-cols-2 tablet:mt-8 lg:mt-0 lg:flex lg:basis-[20%] lg:flex-col lg:border-0 lg:p-0">
      {props.children}
    </div>
  );
};

export default AnalyticsSideCardsHOC;
