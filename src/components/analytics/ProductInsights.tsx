"use client";

import React from "react";
import { SelectInput } from "@components/input/SelectInput"; 
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { months } from "@/store/data/analytics";

interface Props {
  selectedMonth: string;
}

const ProductInsights = ({ selectedMonth }: Props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleMonthChange = (month: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("month", month);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex justify-between items-center flex-auto mb-6">
      <h1 className="text-base tablet:text-2xl font-semibold whitespace-nowrap basis-1/2">
        Products Insight
      </h1>
      <SelectInput
        wrapperClass="basis-1/4"
        placeholder="Search month"
        options={months}
        onValueChange={handleMonthChange}
        value={selectedMonth}
      />
    </div>
  );
};

export default ProductInsights;
