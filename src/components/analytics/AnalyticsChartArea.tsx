import React from "react";
import { getAnalyticsClicksAndViews } from "@/api/view";
import AnalyticsChart from "@components/analytics/AnalyticsChart";
import AnalyticsSideCardsWrapper from "@components/analytics/AnalyticsSideCardsWrapper";
import AnalyticsChartAreaHOC from "./AnalyticsChartAreaHOC";
import { SwitchedRoleQueries } from "@/interface/switchedRole";

interface Props {
  selectedMonth: string;
  queries: SwitchedRoleQueries;
}

const AnalyticsChartArea = async ({ selectedMonth, queries }: Props) => {
  const chartsData = await getAnalyticsClicksAndViews(queries);

  return (
    <AnalyticsChartAreaHOC>
      <AnalyticsChart chartsData={chartsData} />
      <AnalyticsSideCardsWrapper selectedMonth={selectedMonth} queries={queries} />
    </AnalyticsChartAreaHOC>
  );
};

export default AnalyticsChartArea;
