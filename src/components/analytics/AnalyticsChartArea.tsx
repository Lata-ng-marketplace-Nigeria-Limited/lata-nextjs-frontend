import React from "react";
import { getAnalyticsClicksAndViews } from "@/api/view";
import AnalyticsChart from "@components/analytics/AnalyticsChart";
import AnalyticsSideCardsWrapper from "@components/analytics/AnalyticsSideCardsWrapper";
import AnalyticsChartAreaHOC from "./AnalyticsChartAreaHOC";

interface Props {
  selectedMonth: string;
}

const AnalyticsChartArea = async ({ selectedMonth }: Props) => {
  const chartsData = await getAnalyticsClicksAndViews();

  return (
    <AnalyticsChartAreaHOC>
      <AnalyticsChart chartsData={chartsData} />
      <AnalyticsSideCardsWrapper selectedMonth={selectedMonth} />
    </AnalyticsChartAreaHOC>
  );
};

export default AnalyticsChartArea;
