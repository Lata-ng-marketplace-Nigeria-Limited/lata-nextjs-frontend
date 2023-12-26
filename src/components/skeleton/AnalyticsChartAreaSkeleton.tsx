import React from 'react'

const AnalyticsChartAreaSkeleton = () => {
    return (
      <div className="flex border-solid border-[1px] items-center gap-6 lg:justify-between border-grey2 py-6 px-10 flex-col lg:flex-row">
        <div className="lg:basis-[65%] xl:basis-[75%] w-full max-w-full">
          {/* Placeholder for the chart */}
          <div className="bg-gray-200 h-96 rounded-lg"></div>
        </div>
  
        <div className="xl:basis-[20%] lg:basis-[30%] lg:flex lg:flex-col gap-6 grid grid-cols-smaller4 w-full mt-8 lg:mt-0">
          {/* Placeholders for side cards */}
          {[...Array(4)].map((_, index) => (
            <SkeletonSideCard key={index} />
          ))}
        </div>
      </div>
    );
  };

  const SkeletonSideCard = () => {
    return (
      <div className="px-6 pb-[1.12rem] pt-[1.81rem] rounded-lg border-solid shadow-black/10 border-[1px] border-grey2 bg-gray-200">
        <div className="mb-4 bg-gray-300 h-6 rounded-lg"></div>
        <div className="mb-4 bg-gray-300 h-12 rounded-lg"></div>
        <div className="bg-gray-300 h-4 rounded-lg"></div>
      </div>
    );
  };

  export default AnalyticsChartAreaSkeleton;