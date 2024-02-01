import React from "react";
import AnalyticsSideCard from "@components/analytics/AnalyticsSideCard";
import { getSellerAnalyticsApi } from "@/api/view";
import { months } from "@/store/data/analytics";


interface Props {
  selectedMonth: string;
}

const AnalyticsSideCardsWrapper = async ({ selectedMonth }: Props) => {
  const response = await getSellerAnalyticsApi(selectedMonth);

  const monthInFull = months[Number(response?.month) - 1]?.extra ?? "";

  const formatNumber = (number: number) => {
    return Number(new Intl.NumberFormat("en-US").format(number));
  };

  const productClicks = formatNumber(response?.productClicks?.clicks ?? 0);
  const productViews = formatNumber(response?.productViews?.views ?? 0);
  const phoneClicks = formatNumber(response?.phoneClicks?.clicks ?? 0);
  const messageClicks = formatNumber(response?.messageClicks?.clicks ?? 0);


  return (
    <div className="lg:basis-[20%] lg:flex lg:flex-col gap-6 grid p-6 lg:p-0 grid-cols-1 xs:grid-cols-2 w-full mt-4 tablet:mt-8 lg:mt-0 border lg:border-0 rounded">
      <AnalyticsSideCard
        title="Views"
        clicksCount={productViews || 0}
        description={monthInFull}
      />
      <AnalyticsSideCard
        title="Product Clicks"
        clicksCount={productClicks || 0}
        description={monthInFull}
      />
      <AnalyticsSideCard
        title="Phone Clicks"
        clicksCount={phoneClicks || 0}
        description={monthInFull}
      />
      <AnalyticsSideCard
        title="Message Clicks"
        clicksCount={messageClicks}
        description={monthInFull}
      />
    </div>
  );
};

export default AnalyticsSideCardsWrapper;
