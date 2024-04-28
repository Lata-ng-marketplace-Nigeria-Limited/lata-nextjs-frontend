import { getSellerAnalyticsApi } from "@/api/view";
import React from "react";
import AnalyticsTopCards from "@components/analytics/AnalyticsTopCards";
import { GetSellerAnalyticsResponse } from "@/interface/views";
import AnalyticsTopCardsHOC from "./AnalyticsTopCardsHOC";
import { SwitchedRoleQueries } from "@/interface/switchedRole";

interface Props {
  queries: SwitchedRoleQueries;
}
const AnalyticsCardsWrapper = async (props: Props) => {
  const response: GetSellerAnalyticsResponse = await getSellerAnalyticsApi({
    queries: props.queries,
  });

  const formatNumber = (number: number | undefined | null) => {
    if (!number || typeof number !== "number") return 0;
    return number.toLocaleString();
  };
  const productViews = formatNumber(response?.productViews);
  const productClicks = formatNumber(response?.productClicks);
  const phoneClicks = formatNumber(response?.phoneClicks);
  const messageClicks = formatNumber(response?.messageClicks);

  return (
    <div>
      <AnalyticsTopCardsHOC>
        <AnalyticsTopCards
          isTotalViews
          title="Total Views"
          description="Total view of all products"
          number={productViews}
        />
        <AnalyticsTopCards
          title="Total product clicks"
          number={productClicks}
          description="Total product clicks"
        />
        <AnalyticsTopCards
          title="Total phone clicks"
          number={phoneClicks}
          description="Total phone clicks"
        />
        <AnalyticsTopCards
          title="Total message clicks"
          number={messageClicks}
          description="Total message clicks"
        />
      </AnalyticsTopCardsHOC>
    </div>
  );
};

export default AnalyticsCardsWrapper;
