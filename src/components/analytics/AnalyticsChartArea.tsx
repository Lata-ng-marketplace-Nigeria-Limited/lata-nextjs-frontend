import React from "react";
import AnalyticsSideCard from "./AnalyticsSideCard";
import { getSellerAnalyticsApi } from "@/api/view";
import AnalyticsChart from "./AnalyticsChart";
import { months } from "@/store/data/analytics";

interface Props {
  selectedMonth: string;
}

const AnalyticsChartArea = async ({ selectedMonth }: Props) => {
  const response = await getSellerAnalyticsApi(selectedMonth);
  const monthInFull = months[Number(response?.month) - 1]?.extra ?? "";

  return (
    <div className="flex border-solid border-[1px] items-center gap-6 lg:justify-between border-grey2 py-6 px-10 flex-col lg:flex-row">
      <AnalyticsChart />

      <div className="xl:basis-[20%] lg:basis-[30%] lg:flex lg:flex-col gap-2 tablet:gap-6 grid grid-cols-smaller4 w-full mt-4 tablet:mt-8 lg:mt-0">
        <AnalyticsSideCard
          title="Views"
          clicksCount={1200}
          description={monthInFull}
        />
        <AnalyticsSideCard
          title="Product Clicks"
          clicksCount={response?.product?.clicks ?? 0}
          description={monthInFull}
        />
        <AnalyticsSideCard
          title="Phone Clicks"
          clicksCount={response?.phone?.clicks ?? 0}
          description={monthInFull}
        />
        <AnalyticsSideCard
          title="Message Clicks"
          clicksCount={response?.message?.clicks ?? 0}
          description={monthInFull}
        />
      </div>
    </div>
  );
};

export default AnalyticsChartArea;
