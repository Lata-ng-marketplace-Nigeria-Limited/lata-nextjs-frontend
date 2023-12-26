import React from "react";
import AnalyticsSideCard from "./AnalyticsSideCard";
import { getSellerAnalyticsApi } from "@/api/view";
import AnalyticsChart from "./AnalyticsChart";

interface Props {
  selectedMonth: string;
}

const AnalyticsChartArea = async ({ selectedMonth }: Props) => {
  const response = await getSellerAnalyticsApi(selectedMonth);

  return (
    <div className="flex border-solid border-[1px] items-center gap-6 lg:justify-between border-grey2 py-6 px-10 flex-col lg:flex-row">
      <AnalyticsChart />

      <div className="xl:basis-[20%] lg:basis-[30%] lg:flex lg:flex-col gap-6 grid grid-cols-smaller4 w-full mt-8 lg:mt-0">
        <AnalyticsSideCard
          title="Views"
          number={Number("1,200")}
          description={response?.data?.month as string}
        />
        <AnalyticsSideCard
          title="Product Clicks"
          number={(response?.data?.product as any) ?? 0}
          description={response?.data?.month as string}
        />
        <AnalyticsSideCard
          title="Phone Clicks"
          number={(response?.data?.phone as any) || 0}
          description={response?.data?.month as string}
        />
        <AnalyticsSideCard
          title="Message Clicks"
          number={(response?.data?.message as any) ?? 0}
          description={response?.data?.month as string}
        />
      </div>
    </div>
  );
};

export default AnalyticsChartArea;
