import React from "react";
import AnalyticsSideCard from "@components/analytics/AnalyticsSideCard";
import { getAnalyticsClicksAndViews, getSellerAnalyticsApi } from "@/api/view";
import AnalyticsChart from "@components/analytics/AnalyticsChart";
import { months } from "@/store/data/analytics";
import AnalyticsSideCardsWrapper from "@components/analytics/AnalyticsSideCardsWrapper";

interface Props {
  selectedMonth: string;
}

const AnalyticsChartArea = async ({ selectedMonth }: Props) => {
  const chartsData = await getAnalyticsClicksAndViews();

  return (
    <div className="flex border-solid lg:border items-center gap-6 lg:justify-between border-grey2 lg:p-6  py-2  flex-col lg:flex-row">
      <AnalyticsChart chartsData={chartsData} />
      <AnalyticsSideCardsWrapper selectedMonth={selectedMonth} />
    </div>
  );
};

export default AnalyticsChartArea;
