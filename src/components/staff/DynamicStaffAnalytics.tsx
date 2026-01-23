"use client";

import dynamic from "next/dynamic";

interface Props {
    data: {
        month: string;
        totalSales: number;
        targetPoint: number;
    }[];
}

const StaffAnalytics = dynamic(() => import("./StaffAnalytics"), {
    ssr: false,
    loading: () => (
        <div className="h-64 w-full animate-pulse rounded bg-gray-200 lg:basis-[65%] xl:basis-[75%]" />
    ),
});

export default function DynamicStaffAnalytics(props: Props) {
    return <StaffAnalytics {...props} />;
}
