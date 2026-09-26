"use client";

import React, { useEffect, useRef, useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/utils";

export interface DatePickerInputProps {
  value?: string; // Format: YYYY-MM-DD
  onChange?: (date: string) => void;
  placeholder?: string;
  minDate?: string; // Format: YYYY-MM-DD
  disabled?: boolean;
  className?: string;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export const DatePickerInput: React.FC<DatePickerInputProps> = ({
  value = "",
  onChange,
  placeholder = "Select date",
  minDate,
  disabled = false,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse current selected date or fallback to today
  const parsedValue = value ? new Date(value) : null;
  const initialDate = parsedValue && !isNaN(parsedValue.getTime()) ? parsedValue : new Date();

  const [currentYear, setCurrentYear] = useState<number>(initialDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(initialDate.getMonth());

  // Update view when value changes externally
  useEffect(() => {
    if (value) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        setCurrentYear(d.getFullYear());
        setCurrentMonth(d.getMonth());
      }
    }
  }, [value]);

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Calendar math
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  const formatDateString = (year: number, month: number, day: number): string => {
    const m = String(month + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    return `${year}-${m}-${d}`;
  };

  const handleSelectDate = (year: number, month: number, day: number) => {
    const dateStr = formatDateString(year, month, day);
    onChange?.(dateStr);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.("");
  };

  const handleSelectToday = () => {
    const today = new Date();
    handleSelectDate(today.getFullYear(), today.getMonth(), today.getDate());
  };

  // Format label to render (e.g., "Sep 30, 2026")
  const renderFormattedLabel = () => {
    if (!value) return null;
    const d = new Date(value);
    if (isNaN(d.getTime())) return value;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const todayStr = formatDateString(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate()
  );

  // Generate day tiles for grid
  const renderDaysGrid = () => {
    const tiles: React.ReactNode[] = [];

    // Previous month overflow days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const prevMonthIdx = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYearNum = currentMonth === 0 ? currentYear - 1 : currentYear;
      const dateStr = formatDateString(prevYearNum, prevMonthIdx, dayNum);

      tiles.push(
        <button
          key={`prev-${dayNum}`}
          type="button"
          onClick={() => handleSelectDate(prevYearNum, prevMonthIdx, dayNum)}
          className="h-8 w-8 rounded-full text-xs text-gray-300 hover:bg-gray-100 flex items-center justify-center transition"
        >
          {dayNum}
        </button>
      );
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDateString(currentYear, currentMonth, day);
      const isSelected = value === dateStr;
      const isToday = todayStr === dateStr;
      const isDisabledDate = minDate ? dateStr < minDate : false;

      tiles.push(
        <button
          key={`curr-${day}`}
          type="button"
          disabled={isDisabledDate}
          onClick={() => handleSelectDate(currentYear, currentMonth, day)}
          className={cn(
            "h-8 w-8 rounded-full text-xs font-medium flex items-center justify-center transition",
            {
              "bg-[#5113A1] text-white font-bold shadow-sm hover:bg-[#400e82]": isSelected,
              "border border-[#5113A1] text-[#5113A1] font-semibold": isToday && !isSelected,
              "text-gray-700 hover:bg-purple-50 hover:text-[#5113A1]": !isSelected && !isToday && !isDisabledDate,
              "opacity-30 cursor-not-allowed text-gray-400": isDisabledDate,
            }
          )}
        >
          {day}
        </button>
      );
    }

    // Next month overflow days
    const totalTilesSoFar = firstDayOfMonth + daysInMonth;
    const remainingTiles = (7 - (totalTilesSoFar % 7)) % 7;
    for (let day = 1; day <= remainingTiles; day++) {
      const nextMonthIdx = currentMonth === 11 ? 0 : currentMonth + 1;
      const nextYearNum = currentMonth === 11 ? currentYear + 1 : currentYear;

      tiles.push(
        <button
          key={`next-${day}`}
          type="button"
          onClick={() => handleSelectDate(nextYearNum, nextMonthIdx, day)}
          className="h-8 w-8 rounded-full text-xs text-gray-300 hover:bg-gray-100 flex items-center justify-center transition"
        >
          {day}
        </button>
      );
    }

    return tiles;
  };

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      {/* Trigger Button */}
      <div
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={cn(
          "w-full h-11 sm:h-12 px-3 flex items-center justify-between border border-grey5 rounded-lg bg-white cursor-pointer hover:border-grey7 transition select-none text-xs sm:text-sm",
          {
            "border-primary ring-1 ring-primary/20": isOpen,
            "opacity-50 cursor-not-allowed bg-gray-50": disabled,
          }
        )}
      >
        <div className="flex items-center gap-2 text-grey9 truncate">
          <CalendarIcon className="w-4 h-4 text-gray-500 shrink-0" />
          {value ? (
            <span className="font-medium text-gray-900">{renderFormattedLabel()}</span>
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </div>

        {value && !disabled ? (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <ChevronRight
            className={cn("w-4 h-4 text-gray-400 transition-transform duration-200", {
              "rotate-90": isOpen,
            })}
          />
        )}
      </div>

      {/* Popover Calendar */}
      {isOpen && (
        <div className="absolute left-0 mt-1.5 z-50 w-[290px] p-3.5 bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col gap-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Header Controls */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs font-bold text-gray-900">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </span>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 text-center">
            {WEEKDAY_NAMES.map((wd) => (
              <span key={wd} className="text-[11px] font-semibold text-gray-400 py-1">
                {wd}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 place-items-center">
            {renderDaysGrid()}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={handleSelectToday}
              className="text-xs font-semibold text-[#5113A1] hover:underline"
            >
              Today
            </button>

            {value && (
              <button
                type="button"
                onClick={() => {
                  onChange?.("");
                  setIsOpen(false);
                }}
                className="text-xs font-medium text-gray-500 hover:text-gray-700"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
