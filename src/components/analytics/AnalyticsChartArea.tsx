import React from "react";
import AnalyticsSideCard from "./AnalyticsSideCard";
import { getAnalyticsClicksAndViews, getSellerAnalyticsApi } from "@/api/view";
import AnalyticsChart from "./AnalyticsChart";
import { months } from "@/store/data/analytics";

interface Props {
  selectedMonth: string;
}

const AnalyticsChartArea = async ({ selectedMonth }: Props) => {
  const response = await getSellerAnalyticsApi(selectedMonth);
  const chartsData = await getAnalyticsClicksAndViews();

  const monthInFull = months[Number(response?.month) - 1]?.extra ?? "";

  const formatNumber = (number: number) => {
    return Number(new Intl.NumberFormat("en-US").format(number));
  };
  const productClicks = formatNumber(response?.productClicks?.clicks ?? 0);
  const productViews = formatNumber(response?.productViews?.views ?? 0);
  const phoneClicks = formatNumber(response?.phoneClicks?.clicks ?? 0);
  const messageClicks = formatNumber(response?.messageClicks?.clicks ?? 0);

  return (
    <div className="flex border-solid border-[1px] tablet:py-4 items-center gap-6 lg:justify-between border-grey2 lg:py-6  py-2 px-2 tablet:px-10 flex-col lg:flex-row">
      <AnalyticsChart chartsData={chartsData} />

      <div className="xl:basis-[20%] lg:basis-[30%] lg:flex lg:flex-col gap-2 tablet:gap-6 grid grid-cols-smaller4 w-full mt-4 tablet:mt-8 lg:mt-0">
        <AnalyticsSideCard
          title="Views"
          clicksCount={productViews}
          description={monthInFull}
        />
        <AnalyticsSideCard
          title="Product Clicks"
          clicksCount={productClicks}
          description={monthInFull}
        />
        <AnalyticsSideCard
          title="Phone Clicks"
          clicksCount={phoneClicks}
          description={monthInFull}
        />
        <AnalyticsSideCard
          title="Message Clicks"
          clicksCount={messageClicks}
          description={monthInFull}
        />
      </div>
    </div>
  );
};

export default AnalyticsChartArea;
