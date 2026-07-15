"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { MonthlyAnalyticsResponse } from "@/interface/views";

interface Props {
  chartsData: MonthlyAnalyticsResponse;
}

const AnalyticsChart = ({ chartsData }: Props) => {
  const [isTooltipActive, setIsTooltipActive] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  // Map raw data arrays to a unified object array structure required by Recharts
  const productClicksList = chartsData?.productClicksForAllMonths || [];

  const chartData = productClicksList.map((productItem, index) => {
    // Extract short month name (e.g. "Jan", "Feb")
    const shortMonth = productItem?.month?.split(" ")[0]?.slice(0, 3) || "";

    const viewsItem = chartsData?.productViewsForAllMonths?.[index];
    const phoneItem = chartsData?.phoneClicksForAllMonths?.[index];
    const messageItem = chartsData?.messageClicksForAllMonths?.[index];
    const reelsItem = chartsData?.reelsViewsForAllMonths?.[index];

    return {
      name: shortMonth,
      Views: viewsItem?.view || 0,
      "Product clicks": productItem?.product || 0,
      "Phone clicks": phoneItem?.phone || 0,
      "Message clicks": messageItem?.message || 0,
      "Reels views": reelsItem?.reel || 0,
    };
  });

  // Track clicks/taps outside the chart to close tooltip
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (chartRef.current && !chartRef.current.contains(event.target as Node)) {
        setIsTooltipActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside, { passive: true });

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const handleChartInteraction = (state: any) => {
    if (state && state.activeTooltipIndex !== undefined) {
      setIsTooltipActive(true);
    }
  };

  return (
    <div 
      ref={chartRef}
      className="w-full max-w-full rounded border p-4 md:p-6 lg:basis-[76%] lg:rounded-none lg:border-0 lg:p-0 xl:basis-[80%] select-none"
    >
      <div className="w-full overflow-x-auto scrollbar-none">
        <div className="h-[350px] md:h-[420px] lg:h-[460px] min-w-[640px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              barGap={2}
              barCategoryGap="20%"
              onClick={handleChartInteraction}
              onMouseMove={handleChartInteraction}
              margin={{
                top: 20,
                right: 10,
                left: 10,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="none" vertical={false} stroke="#E5E7EB" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6B7280", fontSize: 13 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6B7280", fontSize: 13 }}
                tickFormatter={(val) => val.toLocaleString()}
              />
              <Tooltip
                active={isTooltipActive ? undefined : false}
                cursor={{ fill: "rgba(229, 231, 235, 0.4)" }}
                contentStyle={{
                  background: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: "4px",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
                  fontSize: "12px",
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="rect"
                iconSize={12}
                wrapperStyle={{ fontSize: "12px", paddingTop: "20px" }}
              />
              <Bar dataKey="Views" fill="#5113A1" maxBarSize={30} />
              <Bar dataKey="Product clicks" fill="#AE8CD0" maxBarSize={30} />
              <Bar dataKey="Phone clicks" fill="#7A109E" maxBarSize={30} />
              <Bar dataKey="Message clicks" fill="#8F59FC" maxBarSize={30} />
              <Bar dataKey="Reels views" fill="#D946EF" maxBarSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsChart;
