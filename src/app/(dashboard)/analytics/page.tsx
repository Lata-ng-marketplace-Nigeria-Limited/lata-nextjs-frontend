import HeaderSubText from "@/components/atom/HeaderSubText";
import HeaderText from "@/components/atom/HeaderText";
import React, { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authConfig } from "@authConfig";
import AnalyticsCardsWrapper from "@/components/analytics/AnalyticsCardsWrapper";
import AnalyticsChartArea from "@/components/analytics/AnalyticsChartArea";
import ProductInsights from "@/components/analytics/ProductInsights";
import AnalyticsTopCardSkeleton from "@/components/skeleton/AnalyticsTopCardSkeleton";
import AnalyticsChartAreaSkeleton from "@/components/skeleton/AnalyticsChartAreaSkeleton";
import ProductInsightsLoadingSkeleton from "@/components/skeleton/AnaltyicsProductInsightsSkeleton";

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
      <HeaderText title>{`Seller's`} Analytics</HeaderText>
      <HeaderSubText>Hi {session?.user?.name}, Welcome back!</HeaderSubText>

      <Suspense fallback={<AnalyticsTopCardSkeleton />}>
        <AnalyticsCardsWrapper />
      </Suspense>

      <Suspense fallback={<ProductInsightsLoadingSkeleton />}>
        <ProductInsights selectedMonth={query} />
      </Suspense>

      <Suspense key={query} fallback={<AnalyticsChartAreaSkeleton />}>
        <AnalyticsChartArea selectedMonth={query} />
      </Suspense>
    </div>
  );
};

export default page;
