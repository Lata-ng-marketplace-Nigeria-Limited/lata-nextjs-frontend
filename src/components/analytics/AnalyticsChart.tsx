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
  Legend
);

interface Props {
  chartsData: MonthlyAnalyticsResponse;
}
const AnalyticsChart = ({ chartsData }: Props) => {
  const productClicks = chartsData?.productClicksForAllMonths?.map(
    (product) => product.clicks
  );

  const productViews = chartsData?.productViewsForAllMonths?.map(
    (product) => product.views
  );

  const { data, options } = chartConfig(productClicks, productViews);

  return (
    <div className="lg:basis-[65%] xl:basis-[75%] w-full max-w-full">
      <Bar datasetIdKey="datasetIdKey" data={data} options={options} />
    </div>
  );
};

export default AnalyticsChart;
