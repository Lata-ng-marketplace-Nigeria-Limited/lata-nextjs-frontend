"use client";

import React, { useState } from "react";
import EditKPI, { StaffCategoryTypes } from "./EditKPI";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import EditRewardForm from "./EditRewardForm";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type StaffRewardTypes = "bonus" | "commission";

const EditReward = () => {
  const [selectedCategory, setSelectedCategory] = useState<
    StaffCategoryTypes | ""
  >("");
  const [showFields, setShowFields] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [staffEmail, setStaffEmail] = useState("");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const params = new URLSearchParams(searchParams);

  const setQuery = (value: StaffRewardTypes) => {
    if (value) {
      params.set("reward", value);
    } else {
      params.delete("reward");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <EditKPI
      title="Edit Reward"
      selectedCategory={selectedCategory}
      showFields={showFields}
      selectedMonth={selectedMonth}
      selectedDate={selectedDate}
      staffEmail={staffEmail}
      setStaffEmail={setStaffEmail}
      setSelectedCategory={setSelectedCategory}
      setShowFields={setShowFields}
      setSelectedMonth={setSelectedMonth}
      setSelectedDate={setSelectedDate}
    >
      <Tabs defaultValue={"Bonus"} className="max-w-[400px]">
        <TabsList className="overflo-x-auto mb-6 grid w-full grid-cols-2 gap-1 xs:gap-3">
          <TabsTrigger
            onClick={() => setQuery("bonus")}
            value="Bonus"
            className="px-6 text-xs data-[state=inactive]:border data-[state=inactive]:border-primary data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:text-primary data-[state=inactive]:hover:bg-primary data-[state=inactive]:hover:text-white data-[state=inactive]:hover:shadow xs:text-sm"
          >
            Bonus
          </TabsTrigger>
          <TabsTrigger
            onClick={() => setQuery("commission")}
            value="Commission"
            className="px-6 text-xs data-[state=inactive]:border data-[state=inactive]:border-primary data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:text-primary data-[state=inactive]:hover:bg-primary data-[state=inactive]:hover:text-white data-[state=inactive]:hover:shadow xs:text-sm"
          >
            Commission
          </TabsTrigger>
        </TabsList>
        <TabsContent value="Bonus">
          <EditRewardForm
            email={staffEmail}
            selectedDate={selectedDate}
            selectedMonth={selectedMonth}
            staffCategory={selectedCategory as StaffCategoryTypes}
            query={params.get("reward") as StaffRewardTypes}
            setStaffCategory={setSelectedCategory}
            setShowFields={setShowFields}
          />
        </TabsContent>
        <TabsContent value="Commission">
          <EditRewardForm
            email={staffEmail}
            selectedDate={selectedDate}
            selectedMonth={selectedMonth}
            staffCategory={selectedCategory as StaffCategoryTypes}
            query={params.get("reward") as StaffRewardTypes}
            setStaffCategory={setSelectedCategory}
            setShowFields={setShowFields}
          />
        </TabsContent>
      </Tabs>
    </EditKPI>
  );
};

export default EditReward;
