"use client";

import dynamic from "next/dynamic";
import { MonthlyAnalyticsResponse } from "@/interface/views";

const AnalyticsChart = dynamic(() => import("./AnalyticsChart"), {
    ssr: false,
    loading: () => (
        <div className="h-64 w-full animate-pulse rounded bg-gray-200 lg:basis-[65%] xl:basis-[75%]" />
    ),
});

interface Props {
    chartsData: MonthlyAnalyticsResponse;
}

export default function DynamicAnalyticsChart({ chartsData }: Props) {
    return <AnalyticsChart chartsData={chartsData} />;
}
