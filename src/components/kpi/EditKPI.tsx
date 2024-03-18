"use client";

import React from "react";
import { SelectInput } from "../input/SelectInput";
import TextInput from "../input/TextInput";
import { DateTime } from "luxon";

export type TargetLevelTypes = "A" | "B" | "C" | "D" | "E";
export type StaffCategoryTypes = "all" | "older" | "single";

interface Props {
  children: React.ReactNode;
  title: string;
  staffEmail: string;
  selectedCategory: string;
  selectedDate: string;
  selectedMonth: string;
  setSelectedCategory: React.Dispatch<
    React.SetStateAction<StaffCategoryTypes | "">
  >;
  setSelectedMonth: React.Dispatch<React.SetStateAction<string>>;
  setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
  setShowFields: React.Dispatch<React.SetStateAction<boolean>>;
  showFields: boolean;
  setStaffEmail: React.Dispatch<React.SetStateAction<string>>;
}
const EditKPI = (props: Props) => {
  return (
    <div>
      <h1 className="mb-5 font-semibold">{props.title}</h1>
      <div>
        <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SelectInput
            options={[
              { label: "All Staff", value: "all" },
              { label: "Older staff", value: "older" },
              { label: "Single Staff", value: "single" },
            ]}
            placeholder="Choose category of staff"
            value={props.selectedCategory}
            inputClass="!min-h-12"
            onValueChange={(value) => {
              props.setSelectedCategory(value as StaffCategoryTypes);
              props.setShowFields(false);
            }}
          />

          {props.selectedCategory === "older" && (
            <SelectInput
              placeholder="Choose staff accounts older than..."
              options={Array.from({ length: 12 }, (_, index) => ({
                label: `${index + 1}${index + 1 === 1 ? " month" : " months"}`,
                value: `${index + 1}`,
              }))}
              value={props.selectedMonth}
              inputClass="!min-h-12"
              onValueChange={(value) => {
                if (value) {
                  props.setSelectedMonth(value);
                  const selectedDateISO = DateTime.local()
                    .minus({ months: parseInt(value, 10) })
                    .toISO();
                  const selectedDateMySQL =
                    DateTime.fromISO(selectedDateISO).toFormat("yyyy-MM-dd");
                  props.setSelectedDate(selectedDateMySQL);
                  props.setShowFields(true);
                }
              }}
            />
          )}

          {props.selectedCategory === "single" && (
            <TextInput
              wrapperClass={"w-full mb-4"}
              placeholder={"Enter staff email"}
              label={"Staff Email"}
              inputClass="!h-12"
              value={props.staffEmail}
              onChange={(e) => {
                const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                  e.target.value,
                );
                props.setStaffEmail(e.target.value);
                props.setShowFields(isValidEmail);
              }}
            />
          )}
        </div>

        {(props.selectedCategory === "all" || props.showFields) &&
          props.children}
      </div>
    </div>
  );
};

export default EditKPI;
