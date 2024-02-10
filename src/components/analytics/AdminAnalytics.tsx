import React from "react";
import AnalyticsTopCards from "@components/analytics/AnalyticsTopCards";
import { GetSellerAnalyticsResponse } from "@/interface/views";
import { IAdminAnalytics, getAdminAnalyticsApi } from "@/api/analytics";
import AnalyticsTopCardsHOC from "./AnalyticsTopCardsHOC";

interface Props {
  analyticsCount: IAdminAnalytics["counts"] | undefined;
}

const AdminAnalyticsWrapper = async (props: Props) => {
  const formatNumber = (number: number | undefined | null) => {
    if (!number || typeof number !== "number") return 0;
    return number.toLocaleString();
  };
  const totalSellersCount = formatNumber(props?.analyticsCount?.sellers);
  const totalStaff = formatNumber(props?.analyticsCount?.staff);
  const paidSellersCount = formatNumber(
    props?.analyticsCount?.paidSellersCount,
  );
  const totalPostsCount = formatNumber(props?.analyticsCount?.totalPosts);

  return (
    <AnalyticsTopCardsHOC>
      <AnalyticsTopCards
        isTotalViews
        title="All sellers"
        description="The total number of registered sellers"
        number={totalSellersCount}
      />
      <AnalyticsTopCards
        title="Staff accounts"
        number={totalStaff}
        description="The total number of registered staff"
      />
      <AnalyticsTopCards
        title="Paid Sellers"
        number={paidSellersCount}
        description="The total number of paid subscribers"
      />
      <AnalyticsTopCards
        title="All Posts"
        number={totalPostsCount}
        description="The total number of approved posts"
      />
    </AnalyticsTopCardsHOC>
  );
};

export default AdminAnalyticsWrapper;
