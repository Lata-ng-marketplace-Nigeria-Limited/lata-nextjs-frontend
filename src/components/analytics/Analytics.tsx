"use client";

import React from "react";
import AnalyticsCardsWrapper from "./AnalyticsCardsWrapper";
import ProductInsights, { months } from "./ProductInsights";
import AnalyticsChartArea from "./AnalyticsChartArea";
import { GetSellerAnalyticsResponse } from "@/api/view";

interface Props {
  data: GetSellerAnalyticsResponse;
}

const Analytics = ({ data }: Props) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;

  const [selectedMonth, setSelectedMonth] = React.useState(
    currentMonth.toString(),
  );

  React.useEffect(() => {
    if (!data.isError) {
      console.log(data);
    } else {
      console.log(data);
    }
  }, [data]);

  return (
    <main>
      <AnalyticsCardsWrapper />
      <ProductInsights
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
      />

      <AnalyticsChartArea selectedMonth={selectedMonth} />
    </main>
  );
};

export default Analytics;
