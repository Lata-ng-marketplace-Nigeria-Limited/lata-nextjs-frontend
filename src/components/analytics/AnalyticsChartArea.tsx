"use client";

import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement } from "chart.js";
import { config, data } from "./ChartConfiguration";
import AnalyticsSideCard from "./AnalyticsSideCard";
import { getViewsApi } from "@/service/views";
import { months } from "./ProductInsights";
Chart.register(CategoryScale, LinearScale, BarElement);

interface Props {
  selectedMonth: string;
}

const AnalyticsChartArea = ({ selectedMonth }: Props) => {
  const [monthlyPhoneClicks, setMonthlyPhoneClicks] = React.useState(0);
  const [monthlyProductClicks, setMonthlyProductClicks] = React.useState(0);
  const [monthlyMessageClicks, setMonthlyMessageClicks] = React.useState(0);
  const [month, setMonth] = React.useState("");

  const clicksByMonth = async () => {
    const [phone, products, message] = await Promise.all([
      await getViewsApi("PHONE", selectedMonth),
      await getViewsApi("PRODUCT", selectedMonth),
      await getViewsApi("MESSAGE", selectedMonth),
    ]);

    setMonthlyPhoneClicks(phone.noOfClicksThisMonth);
    setMonthlyProductClicks(products.noOfClicksThisMonth);
    setMonthlyMessageClicks(message.noOfClicksThisMonth);
  };

  React.useEffect(() => {
    clicksByMonth();
    const currentMonth = new Date().getMonth();
    months?.[currentMonth].extra;
    setMonth(months[currentMonth].extra as string);
    console.log({ selectedMonth: months[currentMonth].extra });
  }, [selectedMonth]);

  return (
    <div className="flex border-solid border-[1px] items-center gap-6 lg:justify-between border-grey2 py-6 px-10 flex-col lg:flex-row">
      <div className="lg:basis-[65%] xl:basis-[75%] w-full max-w-full">
        <Bar data={data} options={config.options} className="min-hfull" />
      </div>

      <div className="xl:basis-[20%] lg:basis-[30%] lg:flex lg:flex-col gap-6 grid grid-cols-smaller4 w-full mt-8 lg:mt-0">
        <AnalyticsSideCard title="Views" number={"1,200"} description={month} />
        <AnalyticsSideCard
          title="Product Clicks"
          number={monthlyProductClicks}
          description={month}
        />
        <AnalyticsSideCard
          title="Phone Clicks"
          number={monthlyPhoneClicks}
          description={month}
        />
        <AnalyticsSideCard
          title="Message Clicks"
          number={monthlyMessageClicks}
          description={month}
        />
      </div>
    </div>
  );
};

export default AnalyticsChartArea;
