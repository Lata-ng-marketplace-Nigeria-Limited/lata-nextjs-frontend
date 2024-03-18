"use client";

import React, { useState } from "react";
import { SelectInput } from "../input/SelectInput";
import TextInput from "../input/TextInput";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DateTime } from "luxon";
import EditTargetForm from "./EditTargetForm";

export type TargetLevelTypes = "A" | "B" | "C" | "D" | "E";
export type StaffCategoryTypes = "all" | "older" | "single";

const EditTarget = () => {
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

  const setQuery = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("target", value);
    } else {
      params.delete("target");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  const targetLevels: TargetLevelTypes[] = ["A", "B", "C", "D", "E"];

  return (
    <div>
      <h1 className="mb-5">Edit Target</h1>
      <div>
        <div className="mb-10 grid grid-cols-2 gap-4">
          <SelectInput
            options={[
              { label: "All Staff", value: "all" },
              { label: "Older staff", value: "older" },
              { label: "Single Staff", value: "single" },
            ]}
            placeholder="Choose category of staff"
            value={selectedCategory}
            onValueChange={(value) => {
              setSelectedCategory(value as StaffCategoryTypes);
              setShowFields(false);
            }}
          />

          {selectedCategory === "older" && (
            <SelectInput
              placeholder="Choose staff accounts older than..."
              options={Array.from({ length: 12 }, (_, index) => ({
                label: `${index + 1}${index + 1 === 1 ? " month" : " months"}`,
                value: `${index + 1}`,
              }))}
              value={selectedMonth}
              onValueChange={(value) => {
                if (value) {
                  setSelectedMonth(value);
                  const selectedDateISO = DateTime.local()
                    .minus({ months: parseInt(value, 10) })
                    .toISO();
                  const selectedDateMySQL =
                    DateTime.fromISO(selectedDateISO).toFormat("yyyy-MM-dd");
                  setSelectedDate(selectedDateMySQL);
                  setShowFields(true);
                }
              }}
            />
          )}

          {selectedCategory === "single" && (
            <TextInput
              wrapperClass={"w-full mb-4"}
              placeholder={"Enter staff email"}
              label={"Staff Email"}
              inputClass="!h-12"
              value={staffEmail}
              onChange={(e) => {
                const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                  e.target.value,
                );
                setStaffEmail(e.target.value);
                setShowFields(isValidEmail);
              }}
            />
          )}
        </div>

        {(selectedCategory === "all" || showFields) && (
          <Tabs defaultValue={"A"} className="max-w-[400px]">
            <TabsList className="overflo-x-auto mb-6 grid w-full grid-cols-5 gap-1 xs:gap-3">
              {targetLevels.map((level, index: number) => (
                <TabsTrigger
                  onClick={() => setQuery(level)}
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
                />
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default EditTarget;
