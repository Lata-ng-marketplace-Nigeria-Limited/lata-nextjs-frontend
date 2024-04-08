import React from "react";
import AnalyticsTopCards from "@components/analytics/AnalyticsTopCards";
import { IAdminAnalytics } from "@/api/admin";
import AnalyticsTopCardsHOC from "../analytics/AnalyticsTopCardsHOC";
import {
  ADMIN_ALL_POSTS,
  VIEW_SELLERS_ROUTE,
  VIEW_STAFF_ROUTE,
  PAID_SELLERS_ROUTE,
} from "@/constants/routes";

interface Props {
  analyticsCount: IAdminAnalytics["counts"] | undefined;
}

const AdminAnalyticsWrapper = (props: Props) => {
  const formatNumber = (number: number | undefined | null) => {
    if (!number || typeof number !== "number") return 0;
    return number.toLocaleString();
  };
  const totalSellersCount = formatNumber(
    Number(props?.analyticsCount?.sellers),
  );
  const totalStaff = formatNumber(Number(props?.analyticsCount?.staff));
  const paidSellersCount = formatNumber(
    Number(props?.analyticsCount?.paidSellersCount),
  );
  const totalPostsCount = formatNumber(
    Number(props?.analyticsCount?.totalPosts),
  );

  return (
    <AnalyticsTopCardsHOC>
      <AnalyticsTopCards
        isTotalViews
        title="All sellers"
        description="The total number of registered sellers"
        isClickable
        route={VIEW_SELLERS_ROUTE}
        number={totalSellersCount}
      />
      <AnalyticsTopCards
        title="Staff accounts"
        number={totalStaff}
        isClickable
        route={VIEW_STAFF_ROUTE}
        description="The total number of registered staff"
      />
      <AnalyticsTopCards
        title="Paid Sellers"
        number={paidSellersCount}
        route={PAID_SELLERS_ROUTE}
        isClickable
        description="The total number of paid subscribers"
      />
      <AnalyticsTopCards
        title="All Posts"
        number={totalPostsCount}
        isClickable
        route={ADMIN_ALL_POSTS}
        description="The total number of approved posts"
      />
    </AnalyticsTopCardsHOC>
  );
};

export default AdminAnalyticsWrapper;
