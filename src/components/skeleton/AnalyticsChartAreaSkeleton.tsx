import React from "react";

const AnalyticsChartAreaSkeleton = () => (
  <div className="flex border-solid border-[1px] tablet:py-4 items-center gap-6 lg:justify-between border-grey2 lg:py-6  py-2 px-2 tablet:px-10 flex-col lg:flex-row">
    {/* Skeleton for Chart */}
    <div className="animate-pulse bg-gray-200 lg:basis-[65%] xl:basis-[75%] w-full max-w-full/2 rounded-lg min-h-[300px]"></div>

    {/* Skeleton for Side Cards */}
    <div className="xl:basis-[20%] lg:basis-[30%] lg:flex lg:flex-col gap-2 tablet:gap-6 grid grid-cols-smaller4 w-full mt-4 tablet:mt-8 lg:mt-0">
      {[1, 2, 3, 4].map((index) => (
        <SkeletonSideCard key={index}/>
      ))}
    </div>
  </div>
);

const SkeletonSideCard = () => {
  return (
    <div className="px-6 pb-[1.12rem] pt-[1.81rem] rounded-lg border-solid shadow-black/10 border-[1px] border-grey2 bg-white">
      <div className="mb-4 bg-gray-200 h-3 rounded-lg w-3/4"></div>
      <div className="mb-4 bg-gray-200 h-6 rounded-lg w-1/5"></div>
      <div className="bg-gray-200 h-3 rounded-lg w-3/4"></div>
    </div>
  );
};

export default AnalyticsChartAreaSkeleton;
