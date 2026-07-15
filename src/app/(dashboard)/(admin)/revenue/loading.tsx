import React from "react";

export default function Loading() {
  return (
    <div className="flex flex-col gap-y-6 animate-pulse">
      {/* Title Skeleton */}
      <div className="h-8 w-64 bg-gray-200 rounded-lg"></div>

      {/* Search Input Skeleton */}
      <div className="max-w-md w-full">
        <div className="h-10 w-full bg-gray-200 rounded-lg"></div>
      </div>

      {/* Filters and Actions Bar Skeleton */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between border-b border-grey2 pb-4">
        {/* Type Tabs Skeleton */}
        <div className="flex flex-wrap gap-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-8 w-24 bg-gray-200 rounded-lg"></div>
          ))}
        </div>

        {/* Action Buttons Skeleton */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
          <div className="h-8 w-28 bg-gray-200 rounded-lg"></div>
        </div>
      </div>

      {/* Table Section Skeleton */}
      <div className="bg-white rounded-xl border border-grey2 overflow-hidden p-4 flex flex-col gap-4">
        {/* Table Header Row Skeleton */}
        <div className="grid grid-cols-5 gap-4 pb-2 border-b border-grey2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded w-1/2"></div>
          ))}
        </div>

        {/* Table Body Rows Skeleton */}
        {[...Array(6)].map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="grid grid-cols-5 gap-4 items-center py-4 border-b border-grey1 last:border-b-0"
          >
            {/* User Info Column */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gray-200"></div>
              <div className="flex flex-col gap-1 w-24">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-2 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>

            {/* Type Column */}
            <div>
              <div className="h-5 bg-gray-200 rounded w-20"></div>
            </div>

            {/* Amount Column */}
            <div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>

            {/* Status Column */}
            <div>
              <div className="h-5 bg-gray-200 rounded w-16"></div>
            </div>

            {/* Date Column */}
            <div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
