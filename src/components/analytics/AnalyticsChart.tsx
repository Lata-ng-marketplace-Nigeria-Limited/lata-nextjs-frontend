"use client";

import React from "react";
import { Bar } from "react-chartjs-2";
import { config } from "./chartConfiguration";
import { Chart, CategoryScale, LinearScale, BarElement } from "chart.js";
Chart.register(CategoryScale, LinearScale, BarElement);

const AnalyticsChart = () => {
  return (
    <div className="lg:basis-[65%] xl:basis-[75%] w-full max-w-full">
      <Bar data={config.data} options={config.options} className="min-hfull" />
    </div>
  );
};

export default AnalyticsChart;
