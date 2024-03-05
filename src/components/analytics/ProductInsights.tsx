"use client";

import React from "react";
import { SelectInput } from "@components/input/SelectInput";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { months } from "@/store/data/analytics";
import clsx from "clsx";

interface Props {
  selectedMonth: string;
  title?: string;
  titleClass?: string;
}

const ProductInsights = ({ selectedMonth, title, titleClass }: Props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const handleMonthChange = (month: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("month", month);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="mb-6 flex flex-auto items-center justify-between">
      <h1
        className={clsx(
          "basis-1/2 whitespace-nowrap text-base font-semibold tablet:text-2xl",
          titleClass,
        )}
      >
        {title || "Products Insight"}
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
