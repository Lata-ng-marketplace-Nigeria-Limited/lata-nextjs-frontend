"use client";

import React from "react";
import { SelectInput } from "../input/SelectInput";
import { SearchOption } from "@/interface/input";
import { getViewsApi } from "@/service/views";

export const months: SearchOption[] = [
  { value: "1", label: "Jan", extra: "January" },
  { value: "2", label: "Feb", extra: "February" },
  { value: "3", label: "Mar", extra: "March" },
  { value: "4", label: "Apr", extra: "April" },
  { value: "5", label: "May", extra: "May" },
  { value: "6", label: "Jun", extra: "June" },
  { value: "7", label: "Jul", extra: "July" },
  { value: "8", label: "Aug", extra: "August" },
  { value: "9", label: "Sep", extra: "September" },
  { value: "10", label: "Oct", extra: "October" },
  { value: "11", label: "Nov", extra: "November" },
  { value: "12", label: "Dec", extra: "December" },
];

interface Props {
  selectedMonth: string;
  setSelectedMonth: React.Dispatch<React.SetStateAction<string>>;
  // setMonthInFull: React.Dispatch<React.SetStateAction<string>>;
}

const ProductInsights = ({ selectedMonth, setSelectedMonth }: Props) => {
  const hh = async () => {
    const month = await getViewsApi("PHONE", selectedMonth);
    console.log(month);
  };

  return (
    <div className="flex justify-between items-center flex-auto mb-6">
      <h1 className="text-2xl font-semibold whitespace-nowrap basis-1/2">
        Products Insight
      </h1>
      <SelectInput
        wrapperClass="basis-1/4"
        placeholder="Search month"
        options={months}
        onValueChange={(value) => {
          setSelectedMonth(value);
          hh();
        }}
        value={selectedMonth}
      />
    </div>
  );
};

export default ProductInsights;
