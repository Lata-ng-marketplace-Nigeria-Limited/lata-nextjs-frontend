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
import { staffChartConfig } from "./staffChartConfig";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface Props {
  data: {
    month: string;
    sales: number;
    gradePoint: number;
  }[];
}

const StaffAnalytics = (props: Props) => {
  const { data, options } = staffChartConfig(
    props.data?.map((item) => item.sales),
    props.data?.map((item) => item.gradePoint),
    props.data?.map((item) => item.month?.split(" ")[0]?.slice(0, 3)),
  );

  return (
    <div className="h-full w-full max-w-full rounded border p-6 lg:basis-[65%] lg:rounded-none lg:border-0 lg:p-0 xl:basis-[75%]">
      <Bar datasetIdKey="datasetIdKey" data={data} options={options} />
    </div>
  );
};

export default StaffAnalytics;
