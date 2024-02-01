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

  const productClicks = formatNumber(response?.productClicks ?? 0);
  const productViews = formatNumber(response?.productViews ?? 0);
  const phoneClicks = formatNumber(response?.phoneClicks ?? 0);
  const messageClicks = formatNumber(response?.messageClicks ?? 0);

  return (
    <div className="mt-4 grid w-full grid-cols-1 gap-6 rounded border p-6 xs:grid-cols-2 tablet:mt-8 lg:mt-0 lg:flex lg:basis-[20%] lg:flex-col lg:border-0 lg:p-0">
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
        clicksCount={messageClicks || 0}
        description={monthInFull}
      />
    </div>
  );
};

export default AnalyticsSideCardsWrapper;
