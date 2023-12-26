import HeaderSubText from "@/components/atom/HeaderSubText";
import HeaderText from "@/components/atom/HeaderText";
import React, { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authConfig } from "@authConfig";
import AnalyticsCardsWrapper from "@/components/analytics/AnalyticsCardsWrapper";
import AnalyticsChartArea from "@/components/analytics/AnalyticsChartArea";
import ProductInsights from "@/components/analytics/ProductInsights";

const page = async ({
  searchParams,
}: {
  searchParams?: {
    month?: string;
  };
}) => {
  function getMonthInGMTPlus1() {
    const date = new Date();
    const utcMonth = date.getUTCMonth(); // Get current UTC month
    const currentYear = date.getUTCFullYear(); // Get current year in UTC
    const gmtPlus1Date = new Date(Date.UTC(currentYear, utcMonth, 1, 1)); // Create GMT+1 date
    const gmtPlus1Month = gmtPlus1Date.getUTCMonth(); // Get GMT+1 month

    return gmtPlus1Month + 1; // Adding 1 to match month indexing (0-indexed to 1-indexed)
  }

  const session = await getServerSession(authConfig);
  const query = searchParams?.month || getMonthInGMTPlus1().toString();

  return (
    <div>
      <HeaderText title>Seller Analytics</HeaderText>
      <HeaderSubText>HI {session?.user?.name}, Welcome back!</HeaderSubText>

      <Suspense fallback={<div>Loading</div>}>
        <AnalyticsCardsWrapper />
      </Suspense>

      <Suspense fallback={<div>Loading</div>}>
        <ProductInsights selectedMonth={query} />
      </Suspense>

      <Suspense key={query} fallback={<div>Loading</div>}>
        <AnalyticsChartArea selectedMonth={query} />
      </Suspense>
    </div>
  );
};

export default page;
