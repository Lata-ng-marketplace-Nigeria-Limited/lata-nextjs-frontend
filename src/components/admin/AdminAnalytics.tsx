"use client";

import React from "react";
import AnalyticsTopCards from "@components/analytics/AnalyticsTopCards";
import { IAdminAnalytics } from "@/api/analytics";
import AnalyticsTopCardsHOC from "../analytics/AnalyticsTopCardsHOC";
import { useRouter } from "next/navigation";
import {
  ADMIN_ALL_POSTS,
  ADMIN_ALL_SELLERS_ROUTE,
  ADMIN_ALL_STAFF_ROUTE,
} from "@/constants/routes";

interface Props {
  analyticsCount: IAdminAnalytics["counts"] | undefined;
}

const AdminAnalyticsWrapper = async (props: Props) => {
  const { push } = useRouter();
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
        onClick={() => push(ADMIN_ALL_SELLERS_ROUTE)}
        number={totalSellersCount}
      />
      <AnalyticsTopCards
        title="Staff accounts"
        number={totalStaff}
        isClickable
        onClick={() => push(ADMIN_ALL_STAFF_ROUTE)}
        description="The total number of registered staff"
      />
      <AnalyticsTopCards
        title="Paid Sellers"
        number={paidSellersCount}
        isClickable
        description="The total number of paid subscribers"
      />
      <AnalyticsTopCards
        title="All Posts"
        number={totalPostsCount}
        isClickable
        onClick={() => push(ADMIN_ALL_POSTS)}
        description="The total number of approved posts"
      />
    </AnalyticsTopCardsHOC>
  );
};

export default AdminAnalyticsWrapper;
