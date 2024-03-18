"use client";

import React, { useState } from "react";
import EditKPI, { StaffCategoryTypes, TargetLevelTypes } from "./EditKPI";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import EditTargetForm from "./EditTargetForm";

const targetLevels: TargetLevelTypes[] = ["A", "B", "C", "D", "E"];

const EditTarget = () => {
  const [selectedCategory, setSelectedCategory] = useState<
    StaffCategoryTypes | ""
  >("");
  const [showFields, setShowFields] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [staffEmail, setStaffEmail] = useState("");

  return (
    <EditKPI
      title="Edit Target"
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
      <Tabs defaultValue={"A"} className="max-w-[400px]">
        <TabsList className="overflo-x-auto mb-6 grid w-full grid-cols-5 gap-1 xs:gap-3">
          {targetLevels.map((level, index: number) => (
            <TabsTrigger
              value={level}
              key={index + "tabs-trigger"}
              className="px-6 text-xs data-[state=inactive]:border data-[state=inactive]:border-primary data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:text-primary data-[state=inactive]:hover:bg-primary data-[state=inactive]:hover:text-white data-[state=inactive]:hover:shadow xs:text-sm"
            >
              Target {level}
            </TabsTrigger>
          ))}
        </TabsList>
        {targetLevels.map((level, index) => (
          <TabsContent value={level} key={index + "tabs-content"}>
            <EditTargetForm
              targetLevel={level}
              email={staffEmail}
              staffCategory={selectedCategory as StaffCategoryTypes}
              selectedDate={selectedDate}
              selectedMonth={selectedMonth}
              setShowFields={setShowFields}
              setStaffCategory={setSelectedCategory}
            />
          </TabsContent>
        ))}
      </Tabs>
    </EditKPI>
  );
};

export default EditTarget;
