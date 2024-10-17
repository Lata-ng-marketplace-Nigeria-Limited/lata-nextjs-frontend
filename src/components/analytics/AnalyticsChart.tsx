"use client";

import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { MonthlyAnalyticsResponse } from "@/interface/views";
import { chartConfig } from "@components/analytics/chartConfiguration";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface Props {
  chartsData: MonthlyAnalyticsResponse;
}
const AnalyticsChart = ({ chartsData }: Props) => {
  const productClicks = chartsData?.productClicksForAllMonths?.map(
    (product) => product?.product,
  );

  const productViews = chartsData?.productViewsForAllMonths?.map(
    (product) => product?.view,
  );

  const phoneClicks = chartsData?.phoneClicksForAllMonths?.map(
    (phone) => phone?.phone,
  );

  const messageClicks = chartsData?.messageClicksForAllMonths?.map(
    (message) => message?.message,
  );

  const months = chartsData?.productClicksForAllMonths?.map((product) =>
    product?.month.split(" ")[0]?.slice(0, 3),
  );

  const { data, options } = chartConfig(
    productClicks,
    productViews,
    phoneClicks,
    messageClicks,
    months,
  );

  return (
    <div className="h-full w-full max-w-full rounded border p-6 lg:basis-[65%] lg:rounded-none lg:border-0 lg:p-0 xl:basis-[75%]">
      <Bar datasetIdKey="datasetIdKey" data={data} options={options} />
    </div>
  );
};

export default AnalyticsChart;
