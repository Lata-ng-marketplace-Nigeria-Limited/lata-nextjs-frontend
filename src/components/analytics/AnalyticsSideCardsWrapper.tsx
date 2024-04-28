import React from "react";
import AnalyticsSideCard from "@components/analytics/AnalyticsSideCard";
import { getSellerAnalyticsApi } from "@/api/view";
import { months } from "@/store/data/analytics";
import AnalyticsSideCardsHOC from "./AnalyticsSideCardsHOC";
import { SwitchedRoleQueries } from "@/interface/switchedRole";

interface Props {
  selectedMonth: string;
  queries: SwitchedRoleQueries
}

const AnalyticsSideCardsWrapper = async ({ selectedMonth, queries }: Props) => {
  const response = await getSellerAnalyticsApi({month: selectedMonth, queries});

  const monthInFull = months[Number(response?.month) - 1]?.extra ?? "";

  const formatNumber = (number: number) => {
    if (!number || typeof number !== "number") return 0;
    return number.toLocaleString();
  };

  const productClicks = formatNumber(response?.productClicks ?? 0);
  const productViews = formatNumber(response?.productViews ?? 0);
  const phoneClicks = formatNumber(response?.phoneClicks ?? 0);
  const messageClicks = formatNumber(response?.messageClicks ?? 0);

  return (
    <AnalyticsSideCardsHOC>
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
    </AnalyticsSideCardsHOC>
  );
};

export default AnalyticsSideCardsWrapper;
