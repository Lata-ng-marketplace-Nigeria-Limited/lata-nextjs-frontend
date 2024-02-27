import React from "react";

interface Props {
  children: React.ReactNode;
}
const AnalyticsChartAreaHOC = (props: Props) => {
  return (
    <div className="flex flex-col items-center gap-6 border-solid border-grey2 py-2 lg:flex-row  lg:justify-between  lg:border lg:p-6">
      {props.children}
    </div>
  );
};

export default AnalyticsChartAreaHOC;
